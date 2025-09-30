"use client";

import { User } from "next-auth";
import { AddUser } from "./add_user";
import { useState } from "react";
import { RemoveUser } from "./remove_user";

export function UserList({ user_list }: { user_list: User[] }) {
  const [users, setUsers] = useState<User[]>(user_list); // useState allows us to re-render the page when we update the REFERENCE to the list, aka create a new list when we want to update it so react will re-render the page/update list

  // function that is called by <AddUser> so we can update list when form is submitted
  function addUser(user: User) {
    setUsers([...users, user]); // creates a new array with old items from users and new item we added
  }

  function removeUser(user: User) {
    console.log(user);
    const filtered: User[] = users.filter(
      (user_) => user_.username !== user.username
    );
    console.log("removed: ", filtered);
    setUsers(filtered);
  }

  return (
    <div>
      <AddUser addUser={addUser} />
      <div className="flex flex-col justify-content items-center bg-blue-500 text-white overflow-auto mt-2">
        {users.map((user, index) => (
          <div key={index}>
            {user.username}
            <RemoveUser user={user} removeUser={removeUser} />
          </div>
        ))}
      </div>
    </div>
  );
}
