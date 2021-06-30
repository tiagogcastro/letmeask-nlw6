import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';

import { Button } from '../../components/Button';
import { IllustrationAside } from '../../components/IlustrationAside';
import { UserInfo } from '../../components/UserInfo';

import logoImg from '../../assets/images/logo.svg';

import './styles.scss';

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push(`/`);
    }
  }, [user]);

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      author: {
        id: user?.id,
      name: user?.name,
      avatar: user?.avatar
      },
      endedAt: false,
      questionCount: 0, 
    });
    
    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }
  
  return (
    <div id="page-new-room">
      <IllustrationAside />
      <main>
        <header>
          <UserInfo 
            avatar={user?.avatar}
            name={user?.name}
          />
          <Link to="/rooms/me">
            <Button type="button">Minhas salas</Button>
          </Link>
        </header>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              maxLength={40}
              type="text" 
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit" disabled={!user}>
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? 
            <Link to="/"> Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}