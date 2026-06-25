import { useSearchParams } from 'react-router-dom';
import AccountPanel from '../components/ui/AccountPanel';

export default function AccountPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  return (
    <AccountPanel
      onAuthSuccess={() => {
        if (redirect) {
          window.location.assign(redirect);
        }
      }}
    />
  );
}
