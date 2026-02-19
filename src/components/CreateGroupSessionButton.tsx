"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateGroupSessionModal from "./CreateGroupSessionModal";

export default function CreateGroupSessionButton({
  onCreated
}: { onCreated?: () => void }) {

  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#12245B] text-white px-4 py-2 rounded-lg"
      >
        <FontAwesomeIcon icon={faPlus} />
        New Session
      </button>

      <CreateGroupSessionModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreated={onCreated}
      />
    </>
  );
}
