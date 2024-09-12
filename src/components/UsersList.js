import { useEffect } from "react";
import { useSelector } from "react-redux";
import { addUser, fetchUsers } from "../store";
import Button from './Button';
import Skeleton from "./Skeleton";
import { useThunk } from "../hooks/use-thunk";
import UserListItem from "./UsersListItem";

function UsersList() {
    const [doFetchUsers, isLoadingUsers, loadingUsersError] = useThunk(fetchUsers);
    const [doAddUser, isCreatingUser, creatingUserError] = useThunk(addUser);

    const { data } = useSelector((state) => {
        return state.users;
    });

    useEffect(() => {
        doFetchUsers();
    }, [doFetchUsers]);

    const handleUserAdd = () => {
        doAddUser();
    }

    let content;
    if (isLoadingUsers) {
        content = <Skeleton times={6} className='h-10 w-full'/>
    } else if (loadingUsersError) {
        content = <div>Error fetching data...</div>
    } else {
        content = data.map((user) => {
            return <UserListItem key={user.id} user={user} />
        })
    }

    if (loadingUsersError) {
        return <div>Error fetching data...</div>
    }

    return (
        <div>
            <div className="flex flex-row justify-between items-center m-3">
                <h1 className="m-2 text-xl">Users</h1>
                <Button primary loading={isCreatingUser} onClick={handleUserAdd}>+ Add User</Button>
                {creatingUserError && 'Error creating user...'}
            </div>
            {content}
        </div>
    );
};

export default UsersList;