import React, { useEffect, useState } from "react";
import api from "../services/api";
import ContactForm from "./ContactForm";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const fetchContacts = async (q = "") => {
    try {
      const res = await api.get(
        "/contacts" + (q ? `?search=${encodeURIComponent(q)}` : "")
      );
      setContacts(res.data);
    } catch (err) {
      alert("Failed to fetch contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAdd = async (data) => {
    try {
      const res = await api.post("/contacts", data);
      setContacts((prev) => [res.data, ...prev]);
      setShowAdd(false);
    } catch (err) {
      alert(err.response?.data?.message || "Add failed");
    }
  };

  const handleUpdate = async (data) => {
    try {
      const res = await api.put(`/contacts/${editing._id}`, data);
      setContacts((prev) =>
        prev.map((c) => (c._id === res.data._id ? res.data : c))
      );
      setEditing(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const doSearch = (e) => {
    e.preventDefault();
    fetchContacts(search);
  };

  return (
    <div className="contacts-container">
      <h2>Contacts</h2>

      <div className="contacts-actions">
        <form onSubmit={doSearch} className="search-form">
          <input
            placeholder="Search name/email/phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <button
          className="btn primary"
          onClick={() => {
            setShowAdd(true);
            setEditing(null);
          }}
        >
          New Contact
        </button>
      </div>

      {showAdd && (
        <ContactForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      )}
      {editing && (
        <ContactForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}

      <table className="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <button
                  className="btn small"
                  onClick={() => {
                    setEditing(c);
                    setShowAdd(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn danger small"
                  onClick={() => handleDelete(c._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
