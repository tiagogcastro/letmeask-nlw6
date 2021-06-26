import { Link, useHistory } from 'react-router-dom';

import deleteImg from '../../assets/images/delete.svg';
import logoImg from '../../assets/images/logo.svg';

import './styles.scss';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { UserInfo } from '../../components/UserInfo';

type FirebaseRooms = Array<{
  id: string,
  authorId: string,
  title: string;
  endedAt?: boolean;
}>;

type MeRoom = {
  id: string;
  authorId: string;
  title: string;
  endedAt?: boolean;
}

export function RoomsMe() {
  const { user } = useAuth();
  const [meRooms, setMeRooms] = useState<MeRoom[]>([]);
  const history = useHistory();

  useEffect(() => {
    const roomRef = database.ref(`rooms`)

    roomRef.on('value', async (room) => {
      const rooms: FirebaseRooms = (await roomRef.get()).val();
      
      const parsedRooms = Object.entries(rooms).map(([key, value]) => {
        return {
          id: key,
          authorId: value.authorId,
          title: value.title,
          endedAt: value.endedAt
        }
      });

      const allAuthorId = parsedRooms.map(result => result);

      const roomsFiltered = allAuthorId.filter(result => result.authorId == user?.id)
      
      setMeRooms(roomsFiltered);

    });
 
  }, [user?.id]);

  async function handleOpenRoom(roomId: string) {

    await database.ref(`rooms/${roomId}`).update({
      endedAt: false
    });

    history.push(`/admin/rooms/${roomId}`);
  }

  async function handleDeleteRoom(roomId: string) {
    if(window.confirm('Tem certeza que deseja excluir esta sala?')) {
      await database.ref(`rooms/${roomId}`).remove();
    }
  }

  return (
    <div id="page-roomsMe">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo do letmeask" />

          <div className="infos">
            <UserInfo />
            <Link to={`/rooms`}>
              <Button type="button">
                Outras salas
              </Button>
            </Link>
          </div>
          
        </div>
      </header>

      <div className="rooms">
        <div>
          <Link to={`/rooms/new`}>
            <Button type="button">
              Criar nova sala
            </Button>
          </Link>
          <div className="details">
            <h2>Total de salas: <span> {meRooms.length} </span></h2>
          </div>
        </div>
        
        {meRooms.map(room => (
          <div className="room">
            <h1>{room.title}</h1>
            <div>
              <button
                type="button"
                onClick={() => handleDeleteRoom(room.id)}
                className="iconsButton"
                title="Deletar esta sala"
              >
                <img src={deleteImg} alt="Remover sala" />
              </button>
              {room.endedAt ? (
                <Button onClick={() => handleOpenRoom(room.id)} type="button">
                  Abrir a sala
                </Button>
              ) : (
                <Link to={`/admin/rooms/${room.id}`}>
                  <Button type="button">
                    Ir para a sala
                  </Button>
                </Link>
              )}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}