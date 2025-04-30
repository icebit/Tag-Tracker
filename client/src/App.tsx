import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  homeOutline,
  scanOutline,
  settingsOutline,
  cubeOutline
} from 'ionicons/icons';
import Home from './pages/Home';
import Tags from './pages/Tags';
import Settings from './pages/Settings';
import Items from './pages/Items';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
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
                  <IonLabel>Home</IonLabel>
                </IonItem>
                <IonItem routerLink="/items" routerDirection="root">
                  <IonIcon slot="start" icon={cubeOutline} />
                  <IonLabel>Items</IonLabel>
                </IonItem>
                <IonItem routerLink="/tags" routerDirection="root">
                  <IonIcon slot="start" icon={scanOutline} />
                  <IonLabel>Tags</IonLabel>
                </IonItem>
                <IonItem routerLink="/settings" routerDirection="root">
                  <IonIcon slot="start" icon={settingsOutline} />
                  <IonLabel>Settings</IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonMenu>

          <IonRouterOutlet id="main">
            <Route path="/home" exact>
              <Home />
            </Route>
            <Route path="/items" exact>
              <Items />
            </Route>
            <Route path="/tags" exact>
              <Tags />
            </Route>
            <Route path="/settings" exact>
              <Settings />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
