import React, { useState } from "react";
import { GroupIcon } from "../../svg/svgs";
import "./.css";
import { toast } from "sonner";
import { crateGroup } from "../../services/groups.service";

function CreateGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!name || !description) return toast.error("All fields are required");

    try {
      const res = await crateGroup(name, description);
      if (!res.success) return toast.error(res.message);

      return (window.location.href = "/chats");
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
  };

  return (
    <div className="create-group-container">
      <form onSubmit={handleCreateGroup}>
        <GroupIcon />

        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateGroup;
