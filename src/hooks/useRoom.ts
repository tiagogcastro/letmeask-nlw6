import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

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

type QuestionType = {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

export function useRoom(roomId: string) {
  const history = useHistory();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');
  const [adminId, setAdminId] = useState('');
  
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    async function roomIsClosed() {
      const room = (await roomRef.get()).exists();
      if(room) {
        const endedAt = (await roomRef.get()).val().endedAt;

        if(endedAt) {
          history.push('/');
          return;
        }
      }
    }
    roomIsClosed();

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      if(!databaseRoom) {
        history.push('/');
        return;
      }
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object
            .entries(value.likes ?? {})
            .find(([key, like]) => like.authorId === user?.id)?.[0],
        };
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      setAdminId(databaseRoom.authorId)
    });

    return () => {
      roomRef.off('value');
    };

  }, [roomId, user?.id, history]);

  return {
    questions,
    title,
    adminId
  }
}