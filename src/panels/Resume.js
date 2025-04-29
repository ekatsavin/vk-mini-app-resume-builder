import { Panel, PanelHeader, PanelHeaderBack, FormItem, Input, Button, Group, Textarea } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import '../styles/resumeTemplates.css';
import { useEffect } from 'react'; 
import { Snackbar } from '@vkontakte/vkui';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

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
  const [fileFormat, setFileFormat] = useState('pdf');

  useEffect(() => {
    if (fetchedUser?.photo_200) {
      setPhoto(fetchedUser.photo_200);
    }
  }, [fetchedUser]);

  const [templateStyle, setTemplateStyle] = useState('classic');
  const [errors, setErrors] = useState({});

  const resumeRef = useRef(null);

  const handleDownload = () => {
    if (!validateFields()) {
      alert('Пожалуйста, заполните все обязательные поля!');
      return;
    }
  
    if (fileFormat === 'pdf') {
      downloadResume();
    } else if (fileFormat === 'docx') {
      downloadResumeDocx();
    } else if (fileFormat === 'png') {
      downloadResumePng();
    }
  };

  const downloadResumePng = () => {
    if (!resumeRef.current) return;
  
    html2canvas(resumeRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'resume.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
  
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          layout="vertical"
        >
          🖼️ Резюме успешно скачано в формате .png!
        </Snackbar>
      );
    });
  };  

  const downloadResumeDocx = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: fullName || 'Не указано',
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              text: `Телефон: ${phone || 'Не указано'}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Образование: ${education || 'Не указано'}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Опыт работы: ${experience || 'Не указано'}`,
              spacing: { after: 200 },
            }),
            aboutMe ? new Paragraph({
              text: `О себе: ${aboutMe}`,
              spacing: { after: 200 },
            }) : null,
            skills ? new Paragraph({
              text: `Навыки: ${skills}`,
            }) : null,
          ].filter(Boolean),
        },
      ],
    });
  
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "resume.docx");
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          layout="vertical"
        >
          📄 Резюме успешно скачано в формате .docx!
        </Snackbar>
      );
    });
  };
  

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
  
    return Object.keys(newErrors).length === 0;
  };
  

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Конструктор Резюме
      </PanelHeader>
      {snackbar}

      <div ref={resumeRef} className={`resume-${templateStyle}`}>
        {photo && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={photo}
              alt="Фото профиля"
              style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc' }}
            />
          </div>
        )}

        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{fullName || 'Не указано'}</h2>

        <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid #ddd' }} />

        <p><strong>📞 Телефон:</strong> {phone || 'Не указано'}</p>
        <p><strong>🎓 Образование:</strong> {education || 'Не указано'}</p>
        <p><strong>💼 Опыт работы:</strong> {experience || 'Не указано'}</p>

        {aboutMe && (
          <>
            <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid #ddd' }} />
            <h3 style={{ marginBottom: '8px' }}>О себе</h3>
            <p>{aboutMe}</p>
          </>
        )}

        {skills && (
          <>
            <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid #ddd' }} />
            <h3 style={{ marginBottom: '8px' }}>Навыки</h3>
            <ul style={{ paddingLeft: '20px' }}>
              {skills.split(',').map((skill, i) => (
                <li key={i}>{skill.trim()}</li>
              ))}
            </ul>
          </>
        )}
      </div>

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
                setPhoto(reader.result);
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

      <FormItem top="Выберите формат файла">
        <select
          value={fileFormat}
          onChange={(e) => setFileFormat(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '6px' }}
        >
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="png">PNG</option>
        </select>
      </FormItem>

      <FormItem>
        <Button size="l" mode="primary" stretched onClick={handleDownload}>
          📄 Скачать резюме
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
