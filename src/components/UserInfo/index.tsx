import './styles.scss';

type UserInfoProps = {
  avatar?: string;
  name?: string;
}

export function UserInfo(props: UserInfoProps) {
  return (
    <div className="user-info">
      <img src={props.avatar} alt={props.name} />
      <span>{props.name}</span>
    </div>
  )
}