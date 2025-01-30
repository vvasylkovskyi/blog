import {useLocation, useNavigate, useParams} from 'react-router-dom';

export function withRouter(Component: any) {
  return function WrapperComponent(props: any) {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    return (
      <Component
        {...props}
        location={location}
        params={params}
        navigate={navigate}
      />
    );
  };
}
