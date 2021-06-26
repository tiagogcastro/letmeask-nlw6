import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';

import { Button } from '../../components/Button';
import { IllustrationAside } from '../../components/IlustrationAside';

import logoImg from '../../assets/images/logo.svg';

import './styles.scss';

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }
  
  return (
    <div id="page-new-room">
      <IllustrationAside />
      <main>
        <header>
          <div className="user-info">
            <img src={user?.avatar} alt={user?.name} />
            <span>{user?.name}</span>
          </div>
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
            <Button type="submit">
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