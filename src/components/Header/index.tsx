import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';

import './styles.scss';

type HeaderProps = {
  children?: ReactNode;
}

export function Header({children}: HeaderProps) {
 
  return (
    <header className="header">
      <div className="content">
        <Link to="/">
          <img src={logoImg} alt="Logo do letmeask" />
        </Link>
        {children}
      </div>
    </header>
  );
}