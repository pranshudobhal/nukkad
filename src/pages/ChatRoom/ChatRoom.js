import styles from './ChatRoom.module.css';
import PanToolIcon from '@material-ui/icons/PanTool';
import { HiPhoneMissedCall } from 'react-icons/hi';
import { ChatRoomInput } from './components/ChatRoomInput';
import { useNavigate, useParams } from 'react-router';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { auth, db } from '../../firebase';
import { ChatRoomMessage } from './components/ChatRoomMessage';
import { Error404 } from '../Error404/Error404';
import SyncLoader from 'react-spinners/SyncLoader';
import { useAuthState } from 'react-firebase-hooks/auth';

export function ChatRoom() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [roomDescription] = useDocument(roomID && db.collection('rooms').doc(roomID));
  const [roomMessages, loading] = useCollection(roomID && db.collection('messages').doc(roomID).collection('messages').orderBy('sentAt', 'asc'));
  const roomName = roomDescription?.data() ? roomDescription?.data().name : false;
  const [user] = useAuthState(auth);

  const removeMemberFromRoom = () => {
    db.collection('rooms').doc(roomID).collection('members').doc(user.uid).delete();
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <h1>Nukkad</h1>
        <SyncLoader color={`#047857`} loading={loading} size={15} margin={10} />
      </div>
    );
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
              <span
                onClick={() => {
                  removeMemberFromRoom();
                  navigate(`/`);
                }}
              >
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
