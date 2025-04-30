import { IonPage, IonContent } from '@ionic/react';
import TagList from '../components/TagList';

const Tags: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <TagList />
      </IonContent>
    </IonPage>
  );
};

export default Tags; 