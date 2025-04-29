import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Home, Resume } from './panels';
import { DEFAULT_VIEW, DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { view: activeView = DEFAULT_VIEW, panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation(); // <--- учтено и view, и panel
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner />);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUser(user);
      } catch (error) {
        setUser({
          id: 123456789,
          first_name: 'Иван',
          last_name: 'Иванов',
          city: { title: 'Москва' },
          photo_200: 'https://vk.com/images/camera_200.png',
        });
      }
      setPopout(null);
    }    
    fetchData();
  }, []);

  return (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View nav={activeView} activePanel={activePanel}>
          <Home id={DEFAULT_VIEW_PANELS.HOME} fetchedUser={fetchedUser} />
          <Resume id={DEFAULT_VIEW_PANELS.RESUME} fetchedUser={fetchedUser} />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
