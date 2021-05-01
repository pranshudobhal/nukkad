import styles from './ChatRoom.module.css';
import PanToolIcon from '@material-ui/icons/PanTool';
import { HiPhoneMissedCall } from 'react-icons/hi';
import { ChatRoomInput } from './components/ChatRoomInput';
import { useNavigate, useParams } from 'react-router';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { db } from '../../firebase';
import { ChatRoomMessage } from './components/ChatRoomMessage';
import { Error404 } from '../Error404/Error404';

export function ChatRoom() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [roomDescription] = useDocument(roomID && db.collection('rooms').doc(roomID));
  const [roomMessages, loading] = useCollection(roomID && db.collection('messages').doc(roomID).collection('messages').orderBy('sentAt', 'asc'));
  const roomName = roomDescription?.data() ? roomDescription?.data().name : false;

  if (loading) {
    return <h1>Loader...</h1>;
  } else if (roomDescription && roomMessages && roomName) {
    return (
      <>
        <div className={styles.chatRoomContainer}>
          <div className={styles.chatRoomDescription}>
            <div className={styles.topic}>
              <h2>{roomName}</h2>
            </div>
            <div className={styles.actions}>
              <span>
                <PanToolIcon style={{ fontSize: 25 }} />
              </span>
              <span onClick={() => navigate(`/`)}>
                <HiPhoneMissedCall style={{ fontSize: 25 }} />
              </span>
            </div>
          </div>
          <div className={styles.chatRoomMessages}>
            {roomMessages?.docs.map((doc) => {
              const { messageText, sentAt, userImage, userName } = doc.data();
              return <ChatRoomMessage key={doc.id} messageText={messageText} sentAt={sentAt} userImage={userImage} userName={userName} />;
            })}
          </div>
        </div>
        <ChatRoomInput roomID={roomID} />
      </>
    );
  } else {
    return <Error404 />;
  }
}
