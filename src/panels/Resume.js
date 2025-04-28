import { Panel, PanelHeader, PanelHeaderBack, FormItem, Input, Button, Group } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

export const Resume = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();
  const [fullName, setFullName] = useState(`${fetchedUser?.first_name || ''} ${fetchedUser?.last_name || ''}`);
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [templateStyle, setTemplateStyle] = useState('classic');
  const templates = {
    classic: {
      padding: 20,
      backgroundColor: '#fff',
      color: '#000',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '8px',
    },
    modern: {
      padding: 20,
      backgroundColor: '#f0f2f5',
      color: '#333',
      fontFamily: 'Roboto, sans-serif',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    creative: {
      padding: 20,
      backgroundColor: '#ffe4e1',
      color: '#4a4a4a',
      fontFamily: '"Comic Sans MS", cursive, sans-serif',
      border: '2px dashed #ff69b4',
      borderRadius: '16px',
    },
  };  

  const resumeRef = useRef(null); // Добавляем ref на блок резюме

  const downloadResume = () => {
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
      .save();
  };

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Конструктор Резюме
      </PanelHeader>

      {/* Блок, который будет скачиваться */}
      <div ref={resumeRef} style={templates[templateStyle]}>
      {/* <div ref={resumeRef} style={{ padding: 20, backgroundColor: '#fff', color: '#000', margin: '16px', borderRadius: '8px' }}> */}
        <h2>{fullName}</h2>
        <p><b>Телефон:</b> {phone || 'Не указано'}</p>
        <p><b>Образование:</b> {education || 'Не указано'}</p>
        <p><b>Опыт работы:</b> {experience || 'Не указано'}</p>
      </div>

      <Group>
        <FormItem top="ФИО">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </FormItem>
        <FormItem top="Телефон">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormItem>
        <FormItem top="Образование">
          <Input value={education} onChange={(e) => setEducation(e.target.value)} />
        </FormItem>
        <FormItem top="Опыт работы">
          <Input value={experience} onChange={(e) => setExperience(e.target.value)} />
        </FormItem>
        <FormItem top="Выберите шаблон оформления">
          <select value={templateStyle} onChange={(e) => setTemplateStyle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px' }}>
            <option value="classic">Классический</option>
            <option value="modern">Современный</option>
            <option value="creative">Креативный</option>
          </select>
        </FormItem>
        <FormItem>
          <Button size="l" stretched onClick={downloadResume}>
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
