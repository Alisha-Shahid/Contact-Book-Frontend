import React, { useState, useEffect } from 'react';

export default function ContactForm({ initial = {name:'', email:'', phone:''}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);

  useEffect(()=> {
    setName(initial.name);
    setEmail(initial.email);
    setPhone(initial.phone);
  }, [initial.name, initial.email, initial.phone]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone });
  };

  return (
    <form onSubmit={submit} className="contact-form">
  <div>
    <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
  </div>
  <div>
    <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
  </div>
  <div>
    <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
  </div>
  <div className="form-actions">
    <button type="submit">Save</button>
    {onCancel && <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>}
  </div>
</form>
  )
}
