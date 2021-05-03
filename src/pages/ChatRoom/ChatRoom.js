import styles from './ChatRoom.module.css';
import CloseIcon from '@material-ui/icons/Close';
import PeopleIcon from '@material-ui/icons/People';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ChatIcon from '@material-ui/icons/Chat';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import { RiUserUnfollowFill } from 'react-icons/ri';
import { FaHandPointer } from 'react-icons/fa';
import { FaHandRock } from 'react-icons/fa';
import { ChatRoomInput } from './components/ChatRoomInput';
import { useNavigate, useParams } from 'react-router';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { auth, db } from '../../firebase';
import { ChatRoomMessage } from './components/ChatRoomMessage';
import { Error404 } from '../Error404/Error404';
import SyncLoader from 'react-spinners/SyncLoader';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';

export function ChatRoom() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [roomDescription] = useDocument(roomID && db.collection('rooms').doc(roomID));
  const [roomMessages, loading] = useCollection(roomID && db.collection('messages').doc(roomID).collection('messages').orderBy('sentAt', 'asc'));
  const roomName = roomDescription?.data() ? roomDescription?.data().name : false;
  const isRoomOpen = roomDescription?.data() ? roomDescription?.data().roomOpen : false;
  const [user] = useAuthState(auth);
  const [membersDoc] = useCollection(db.collection('rooms').doc(roomID).collection('members').doc(user.uid));
  const [membersCollection] = useCollection(db.collection('rooms').doc(roomID).collection('members'));
  const membersRef = db.collection('rooms').doc(roomID).collection('members');
  const isAdmin = user.uid === roomDescription?.data()?.createdBy;
  const isUserAllowedToText = membersDoc?.data() ? membersDoc?.data().write : false;
  const [closeRoomModal, showCloseRoomModal] = useState(false);
  const [saveChatModal, showSaveChatModal] = useState(false);
  const [moreModal, showMoreModal] = useState(false);
  const [membersModal, showMembersModal] = useState(false);

  const toggleCloseRoomModal = () => showCloseRoomModal((closeRoomModal) => !closeRoomModal);
  const toggleSaveChatModal = () => showSaveChatModal((saveChatModal) => !saveChatModal);
  const toggleMoreModal = () => showMoreModal((moreModal) => !moreModal);
  const toggleMembersModal = () => showMembersModal((membersModal) => !membersModal);

  const userToggleForPermissionToText = () => {
    if (membersDoc?.data().needPermissionToText) {
      db.collection('rooms').doc(roomID).collection('members').doc(user.uid).update({
        needPermissionToText: false,
      });
    } else {
      db.collection('rooms').doc(roomID).collection('members').doc(user.uid).update({
        needPermissionToText: true,
      });
    }
  };

  const adminToggleWritePermission = (memberID) => {
    const memberToggle = db.collection('rooms').doc(roomID).collection('members').doc(memberID);

    memberToggle
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().write) {
            db.collection('rooms').doc(roomID).collection('members').doc(memberID).update({
              write: false,
            });
          } else {
            db.collection('rooms').doc(roomID).collection('members').doc(memberID).update({
              write: true,
            });
          }
        } else {
          console.log('No such member present!');
        }
      })
      .catch((error) => {
        console.log('Error giving write permission to user:', error);
      });
  };

  const removeMemberFromRoomByAdmin = (memberID) => {
    if (memberID === user.uid) {
      return;
    } else {
      membersRef
        .doc(memberID)
        .delete()
        .catch((error) => console.log('Error removing members from a room by admin! ', error));
    }
  };

  const removeMemberFromRoom = () => {
    if (isAdmin) {
      return;
    }
    membersRef
      .doc(user.uid)
      .delete()
      .catch((error) => console.log('Error removing members from a room! ', error));
  };

  const saveChat = () => {
    db.collection('rooms')
      .doc(roomID)
      .update({
        saveChat: false,
      })
      .catch((error) => console.log('Error saving chat! ', error));
  };

  if (isRoomOpen && isAdmin) {
    membersRef.doc(user.uid).update({
      write: true,
    });
  }

  const closeRoom = () => {
    db.collection('rooms')
      .doc(roomID)
      .update({
        roomOpen: false,
      })
      .catch((error) => console.log('Error closing room! ', error));

    membersRef
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.update({
            write: false,
          });
        });
      })
      .catch((error) => console.log('Error updating write permission to false when closing room! ', error));
  };

  function ChatRoomActionButtons() {
    function AdminActionButtons() {
      return (
        <>
          <span onClick={toggleMembersModal}>
            <PeopleIcon />
          </span>
          <span onClick={toggleMoreModal}>
            <MoreHorizIcon style={{ fontSize: 25 }} />
          </span>
          {moreModal && (
            <div
              className={styles.modalCloseContainer}
              onClick={() => {
                toggleMoreModal();
              }}
            >
              <div
                className={styles.moreModalContainer}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ul>
                  <li
                    onClick={() => {
                      toggleMoreModal();
                      removeMemberFromRoom();
                      navigate('/');
                    }}
                  >
                    Disconnect
                  </li>
                  <li
                    onClick={() => {
                      toggleMoreModal();
                      toggleCloseRoomModal(true);
                    }}
                  >
                    End Room
                  </li>
                  <li onClick={toggleMoreModal}>Cancel</li>
                </ul>
              </div>
            </div>
          )}
          {membersModal && (
            <div
              className={styles.modalCloseContainer}
              onClick={() => {
                toggleMembersModal();
              }}
            >
              <div
                className={styles.membersModalContainer}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className={styles.closeIcon} onClick={toggleMembersModal}>
                  <CloseIcon style={{ color: '#7abb27' }} />
                </span>
                <ul className={styles.membersList}>
                  <li>Requesting to text</li>
                  {membersCollection?.docs.map((doc) => {
                    const { needPermissionToText, memberID, memberImage, memberName, write } = doc.data();
                    if (needPermissionToText) {
                      return (
                        <li key={memberID}>
                          <img src={memberImage} alt={memberName} />
                          <div className={styles.memberName}>
                            <h4>{memberName}</h4>
                          </div>
                          <div className={styles.memberActions}>
                            <span onClick={() => adminToggleWritePermission(memberID)}>{write ? <ChatIcon style={{ fontSize: 20 }} /> : <SpeakerNotesOffIcon style={{ fontSize: 20 }} />}</span>
                            <span onClick={() => removeMemberFromRoomByAdmin(memberID)}>
                              <RiUserUnfollowFill style={{ fontSize: 20 }} />
                            </span>
                          </div>
                        </li>
                      );
                    }
                    return false;
                  })}
                </ul>
                <ul className={styles.membersList}>
                  <li>All Members</li>
                  {membersCollection?.docs.map((doc) => {
                    const { needPermissionToText, memberID, memberImage, memberName, write } = doc.data();
                    if (!needPermissionToText) {
                      return (
                        <li key={memberID}>
                          <img src={memberImage} alt={memberName} />
                          <div className={styles.memberName}>
                            <h4>{memberName}</h4>
                          </div>
                          <div className={styles.memberActions}>
                            <span onClick={() => adminToggleWritePermission(memberID)}>{write ? <ChatIcon style={{ fontSize: 20 }} /> : <SpeakerNotesOffIcon style={{ fontSize: 20 }} />}</span>
                            <span onClick={() => removeMemberFromRoomByAdmin(memberID)}>
                              <RiUserUnfollowFill style={{ fontSize: 20 }} />
                            </span>
                          </div>
                        </li>
                      );
                    }
                    return false;
                  })}
                </ul>
              </div>
            </div>
          )}
        </>
      );
    }

    function UserActionButtons() {
      return (
        <>
          <span onClick={userToggleForPermissionToText}>{membersDoc?.data().needPermissionToText ? <FaHandPointer style={{ fontSize: 25 }} /> : <FaHandRock style={{ fontSize: 20 }} />}</span>
          <span onClick={toggleMoreModal}>
            <MoreHorizIcon style={{ fontSize: 25 }} />
          </span>
          {moreModal && (
            <div
              className={styles.modalCloseContainer}
              onClick={() => {
                toggleMoreModal();
              }}
            >
              <div
                className={styles.moreModalContainer}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ul>
                  <li
                    onClick={() => {
                      toggleMembersModal();
                      showMoreModal(false);
                    }}
                  >
                    Show Members
                  </li>
                  <li
                    onClick={() => {
                      toggleMoreModal();
                      removeMemberFromRoom();
                      navigate('/');
                    }}
                  >
                    Disconnect
                  </li>
                  <li onClick={toggleMoreModal}>Cancel</li>
                </ul>
              </div>
            </div>
          )}
          {membersModal && (
            <div
              className={styles.modalCloseContainer}
              onClick={() => {
                toggleMembersModal();
              }}
            >
              <div
                className={styles.membersModalContainer}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className={styles.closeIcon} onClick={toggleMembersModal}>
                  <CloseIcon style={{ color: '#7abb27' }} />
                </span>
                <ul className={styles.membersListUser}>
                  <li>All Members</li>
                  {membersCollection?.docs.map((doc) => {
                    const { memberID, memberImage, memberName } = doc.data();
                    return (
                      <li key={memberID}>
                        <span>
                          <img src={memberImage} alt={memberName} />
                        </span>
                        <span>{memberName}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        {isAdmin && <AdminActionButtons />}
        {!isAdmin && <UserActionButtons />}
      </>
    );
  }

  function CloseRoomModal() {
    return (
      <>
        {closeRoomModal && (
          <div
            className={styles.modalCloseContainer}
            onClick={() => {
              toggleCloseRoomModal();
            }}
          >
            <div
              className={styles.closeRoomModalContainer}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h4>Do you really want to close the room?</h4>
              <div className={styles.actions}>
                <span
                  onClick={() => {
                    toggleCloseRoomModal();
                  }}
                >
                  Cancel
                </span>
                <span
                  onClick={() => {
                    toggleCloseRoomModal();
                    toggleSaveChatModal(true);
                  }}
                >
                  Yes
                </span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function SaveChatModal() {
    return (
      <>
        {saveChatModal && (
          <div
            className={styles.modalCloseContainer}
            onClick={() => {
              toggleSaveChatModal();
            }}
          >
            <div
              className={styles.saveChatModalContainer}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h4>Want to save chat before closing the room?</h4>
              <span
                onClick={() => {
                  showCloseRoomModal(false);
                  toggleSaveChatModal();
                }}
              >
                <CloseIcon style={{ color: '#7abb27' }} />
              </span>
              <div className={styles.actions}>
                <span
                  onClick={() => {
                    saveChat();
                    toggleSaveChatModal();
                    navigate(`/`);
                  }}
                >
                  No
                </span>
                <span
                  onClick={() => {
                    closeRoom();
                    toggleSaveChatModal();
                    navigate(`/`);
                  }}
                >
                  Yes
                </span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <h1>Nukkad</h1>
        <SyncLoader color={`#7abb27`} loading={loading} size={15} margin={10} />
      </div>
    );
  } else if (roomDescription && roomMessages && roomName) {
    return (
      <>
        <div className={styles.chatRoomContainer}>
          <div className={styles.chatRoomDescription}>
            <div className={styles.topic}>
              <h2>{roomName}</h2>
              <p>Status: {isRoomOpen ? 'Live' : 'Closed'}</p>
            </div>
            <div className={styles.actions}>{isRoomOpen && <ChatRoomActionButtons />}</div>
            <CloseRoomModal />
            <SaveChatModal />
          </div>
          <div className={styles.chatRoomMessages}>
            {roomMessages?.docs.map((doc) => {
              const { messageText, sentAt, sentBy, userImage, userName } = doc.data();
              return <ChatRoomMessage key={doc.id} messageText={messageText} sentAt={sentAt} sentBy={sentBy} userImage={userImage} userName={userName} />;
            })}
          </div>
        </div>
        {isRoomOpen && <ChatRoomInput roomID={roomID} isUserAllowedToText={isUserAllowedToText} />}
      </>
    );
  } else {
    return <Error404 />;
  }
}
