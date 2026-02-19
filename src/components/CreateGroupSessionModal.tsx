"use client";

import { useState } from "react";
import { analyzedService, CreateGroupSessionPayload } from "../services/client/analyzed.service";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUpload, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const initialState: CreateGroupSessionPayload = {
  fellowName: "",
  groupId: 0,
  transcriptFile: null,
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateGroupSessionModal({
  isOpen,
  onClose,
  onCreated
}: Props) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { name, value } = e.target;
      setData(prev => ({ ...prev, [name]: value }));
    } catch (error) {
      throw error;
    }
  };

  const handleFileUpload = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    try {
      if (!e.target.files?.[0]) return;

      const file = e.target.files[0];

      if (file.type !== "application/json") {
        toast.error("Only JSON files allowed");
        return;
      }

      setData(prev => ({
        ...prev,
        transcriptFile: file
      }));
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await analyzedService.createGroupSession({
        fellowName: data.fellowName,
        groupId: Number(data.groupId),
        transcriptFile: data.transcriptFile
      });

      toast.success("Session created");
      onCreated?.();
      onClose();
      setData(initialState);

    } catch (err: any) {
      toast.error(err.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-bold">Create Group Session</h3>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <input
            name="fellowName"
            value={data.fellowName}
            onChange={handleChange}
            placeholder="Fellow Name"
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="groupId"
            type="number"
            value={data.groupId}
            onChange={handleChange}
            placeholder="Group ID"
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* JSON Upload */}
          <label className="border border-dashed p-4 rounded-lg flex gap-3 items-center cursor-pointer">
            <FontAwesomeIcon icon={faUpload} />
            <span>
              {data.transcriptFile?.name || "Upload JSON Transcript"}
            </span>
            <input
              type="file"
              accept="application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* ACTIONS */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            {loading
              ? <FontAwesomeIcon icon={faCircleNotch} spin />
              : "Create Session"}
          </button>

        </form>
      </div>
    </div>
  );
}
