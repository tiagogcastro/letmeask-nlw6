import { ReactNode } from 'react';
import cxLib from 'classnames';

import './styles.scss';
import { UserInfo } from '../UserInfo';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children
}: QuestionProps) {
  return (
    <div className={cxLib(
      'question',
      {answered: isAnswered},
      {highlighted: isHighlighted && !isAnswered}
    )}>
      <p>{content}</p>
      <footer>
        <UserInfo 
          avatar={author.avatar}
          name={author.name}
        />
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}