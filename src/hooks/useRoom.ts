import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type FirebaseQuestions = Record<string, {
  author: {
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
  
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    async function roomIsClosed() {
      const room = (await roomRef.get()).exists();
      const endedAt = (await roomRef.get()).val().endedAt;
      
      if(room && endedAt ){
        history.push('/');
        return;
      }
    }
    roomIsClosed();
    
    roomRef.on('value', room => {
      const databaseRoom = room.val();
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
      }).sort((a, b) => {
        return (
          (
            // Highlighted 1°
            Number(!a.isHighLighted) - Number(!b.isHighLighted)
          ) - (
            // Resto em 2°
            // Answered 3°
            Number(!a.isAnswered) - Number(!b.isAnswered)
          )
        )
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off('value');
    };

  }, [roomId, user?.id]);

  return {
    questions,
    title
  }
}