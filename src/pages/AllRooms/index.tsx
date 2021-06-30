import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { UserInfo } from '../../components/UserInfo';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import './styles.scss';

type FirebaseQuestions = Record<string, {
  author: {
    id: string;
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>;
}>;

type DatabaseRoomType = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  questions?: FirebaseQuestions;
  endedAt: boolean,
  questionCount: number,
}

export function AllRooms() {
  const { user, signInWithGoogle } = useAuth();
  const [rooms, setRooms] = useState<DatabaseRoomType[]>([]);
  
  useEffect(() => {
    const roomsRef = database.ref('rooms');

    roomsRef.on('value', async (rooms) => {
      const databaseRooms: DatabaseRoomType[] = rooms.val() ?? {};
      
      const roomsParsed = Object.entries(databaseRooms).map(([key, value]) => {
        return {
          id: key,
          title: value.title,
          author: value.author,
          endedAt: value.endedAt,
          questionCount: Object.entries(value.questions ?? {}).length,
        };
      }).filter(where => where.author.id !== user?.id && where.endedAt !== true);

      setRooms(roomsParsed);
    });
  }, [user?.id]);
  
  return (
    <div id="page-allRooms">
      <Header>
        {user ? (
        <div>
          <Link to="/rooms/me">
            <Button>Minhas salas</Button>
          </Link>
          <UserInfo 
            avatar={user.avatar}
            name={user.name}
          />
        </div>
        ) : (
          <Button onClick={signInWithGoogle}>Fazer login</Button>
        )}
      </Header>

      <main>
        <h1>Salas disponíveis</h1>
        <div className="rooms">
          {rooms.map(room => (
            <div className="room" key={room.id}>
              <h1>{room.title}</h1>
              <div>
                <UserInfo
                  name={room.author.name}
                  avatar={room.author.avatar}
                />
                <Link to={`rooms/${room.id}`}>
                  <Button>Entrar na sala</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}