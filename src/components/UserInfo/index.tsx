import { useAuth } from '../../hooks/useAuth';

import './styles.scss';

type UserInfoProps = {
  avatar?: string;
  name?: string;
}

export function UserInfo(props: UserInfoProps) {
  const {user} = useAuth();

  const userProps = {
    avatar: user?.avatar || props.avatar,
    name: user?.name || props.name,
  };
  
  return (
    <div className="user-info">
      <img src={userProps.avatar} alt={userProps.name} />
      <span>{userProps.name}</span>
    </div>
  )
}