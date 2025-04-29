import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonPage
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  homeOutline,
  scanOutline,
  analyticsOutline,
  settingsOutline
} from 'ionicons/icons';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TagManagement from './components/TagManagement';

const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <IonMenu contentId="main">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Menu</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                <IonItem routerLink="/home" routerDirection="root">
                  <IonIcon slot="start" icon={homeOutline} />
                  <IonLabel>Dashboard</IonLabel>
                </IonItem>
                <IonItem routerLink="/tags" routerDirection="root">
                  <IonIcon slot="start" icon={scanOutline} />
                  <IonLabel>RFID Tags</IonLabel>
                </IonItem>
                <IonItem routerLink="/analytics" routerDirection="root">
                  <IonIcon slot="start" icon={analyticsOutline} />
                  <IonLabel>Analytics</IonLabel>
                </IonItem>
                <IonItem routerLink="/settings" routerDirection="root">
                  <IonIcon slot="start" icon={settingsOutline} />
                  <IonLabel>Settings</IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonMenu>

          <IonRouterOutlet id="main">
            <Route path="/home" render={() => (
              <IonPage>
                <Dashboard />
              </IonPage>
            )} exact />
            <Route path="/tags" render={() => (
              <IonPage>
                <TagManagement />
              </IonPage>
            )} exact />
            <Route path="/analytics" render={() => (
              <IonPage>
                <AnalyticsDashboard />
              </IonPage>
            )} exact />
            <Redirect from="/" to="/home" exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App; 