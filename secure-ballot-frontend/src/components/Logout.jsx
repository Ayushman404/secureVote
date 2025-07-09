import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { deletePrivateKey } from '../utils/idb';


const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirm = window.confirm(
      'Are you sure you want to logout?\n\nMake sure you have voted, or you will lose access forever.'
    );

    if (!confirm) return;

    await deletePrivateKey();
    localStorage.removeItem('email');
    localStorage.removeItem('keyCreatedAt');

    window.location.href = '/googlelogin';
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 my-2 justify-center cursor-pointer rounded-xl text-red-600 hover:text-white hover:bg-red-600 transition-all border border-red-600 font-semibold w-full text-left"
    >
      <MdLogout size={18}/>
      Logout
    </button>
  );
};

export default LogoutButton;