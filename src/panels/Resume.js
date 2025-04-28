import { Panel, PanelHeader, PanelHeaderBack, FormItem, Input, Button, Group, Textarea } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import '../styles/resumeTemplates.css';
import { useEffect } from 'react'; 
import { FileTextIcon } from 'lucide-react';
import { Snackbar } from '@vkontakte/vkui';

export const Resume = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [skills, setSkills] = useState('');
  const [photo, setPhoto] = useState('');
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    if (fetchedUser?.photo_200) {
      setPhoto(fetchedUser.photo_200);
    }
  }, [fetchedUser]);

  const [templateStyle, setTemplateStyle] = useState('classic');
  const [errors, setErrors] = useState({}); // состояние ошибок

  const resumeRef = useRef(null);

  const downloadResume = () => {
    if (!validateFields()) {
      alert('Пожалуйста, заполните все обязательные поля!');
      return;
    }
  
    if (!resumeRef.current) return;
  
    html2pdf()
      .set({
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(resumeRef.current)
      .save()
      .then(() => {
        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(null)}
            layout="vertical"
          >
            📄 Резюме успешно скачано!
          </Snackbar>
        );
      });
  };  
  

  const validateFields = () => {
    const newErrors = {};
  
    if (!fullName.trim()) newErrors.fullName = 'ФИО обязательно';
    if (!phone.trim()) newErrors.phone = 'Контактные данные обязательны';
    if (!education.trim()) newErrors.education = 'Образование обязательно';
    if (!experience.trim()) newErrors.experience = 'Опыт работы обязателен';
    if (!photo) newErrors.photo = 'Фотография обязательна';
  
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0; // если ошибок нет — всё ок
  };
  

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Конструктор Резюме
      </PanelHeader>
      {snackbar}
      {/* Блок для скачивания */}
      <div ref={resumeRef} className={`resume-${templateStyle}`}>
        {photo && (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img
              src={photo}
              alt="Фото профиля"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        )}
        <h2 style={{ textAlign: 'center' }}>{fullName || 'Не указано'}</h2>
        <p><b>Телефон:</b> {phone || 'Не указано'}</p>
        <p><b>Образование:</b> {education || 'Не указано'}</p>
        <p><b>Опыт работы:</b> {experience || 'Не указано'}</p>
        {aboutMe && <p><b>О себе:</b> {aboutMe}</p>}
        {skills && <p><b>Навыки:</b> {skills}</p>}
      </div>

      {/* Форма для заполнения */}
      <Group>
      <FormItem top="Фотография" status={errors.photo ? 'error' : 'default'} bottom={errors.photo}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setPhoto(reader.result); // сохраняем в состояние
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </FormItem>

      <FormItem top="ФИО" status={errors.fullName ? 'error' : 'default'} bottom={errors.fullName}>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={`${fetchedUser?.first_name || 'Иван'} ${fetchedUser?.last_name || 'Иванов'}`}
        />
      </FormItem>

      <FormItem top="Телефон" status={errors.phone ? 'error' : 'default'} bottom={errors.phone}>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (999) 123-45-67"
        />
      </FormItem>

      <FormItem top="Образование" status={errors.education ? 'error' : 'default'} bottom={errors.education}>
        <Input
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="МГУ им. М.В. Ломоносова, Факультет ВМК"
        />
      </FormItem>

      <FormItem top="Опыт работы" status={errors.experience ? 'error' : 'default'} bottom={errors.experience}>
        <Input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Стажировка в VK Education, разработка мини-приложений"
        />
      </FormItem>

      <FormItem top="О себе">
        <Textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="Начинающий разработчик с интересом к фронтенду и разработке мини-приложений."
        />
      </FormItem>

      <FormItem top="Навыки (через запятую)">
        <Input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="JavaScript, React, VK Mini Apps, HTML, CSS"
        />
      </FormItem>
      <FormItem top="Выберите шаблон оформления">
        <select
          value={templateStyle}
          onChange={(e) => setTemplateStyle(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '6px' }}
        >
          <option value="classic">Классический</option>
          <option value="modern">Современный</option>
          <option value="creative">Креативный</option>
          <option value="business">Деловой</option>
        </select>
      </FormItem>

      <FormItem>
        <Button size="l" mode="primary" stretched onClick={downloadResume} before={<FileTextIcon size={20} />}>
          Скачать резюме (PDF)
        </Button>
      </FormItem>

      </Group>
    </Panel>
  );
};

Resume.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.object,
};
