"use client";

import { useEffect, useState } from "react";

type Profile = {
  id?: string;
  company_name: string;
  registration_number?: string | null;
  vat_number?: string | null;
  tax_pin?: string | null;
  csd_number?: string | null;
  physical_address?: string | null;
  postal_address?: string | null;
  email?: string | null;
  phone?: string | null;
  cellphone?: string | null;
  signatory_name?: string | null;
  signatory_id_number?: string | null;
  signatory_title?: string | null;
  is_foreign_supplier?: boolean | null;
  is_accredited_rep?: boolean | null;
};

const emptyProfile: Profile = {
  company_name: "",
  registration_number: "",
  vat_number: "",
  tax_pin: "",
  csd_number: "",
  physical_address: "",
  postal_address: "",
  email: "",
  phone: "",
  cellphone: "",
  signatory_name: "",
  signatory_id_number: "",
  signatory_title: "",
  is_foreign_supplier: false,
  is_accredited_rep: false
};

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/company");
      if (!res.ok) return;
      const data = await res.json();
      if (data) {
        setProfile({ ...emptyProfile, ...data });
      }
    };
    loadProfile();
  }, []);

  const handleChange = (key: keyof Profile, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    const method = profile.id ? "PUT" : "POST";
    const url = profile.id ? `/api/company/${profile.id}` : "/api/company";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });

    if (!res.ok) {
      setStatus("Unable to save profile.");
      return;
    }

    const data = await res.json();
    setProfile({ ...emptyProfile, ...data });
    setStatus("Profile saved.");
  };

  return (
    <section className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Company Profile</h2>
        <p className="text-slate-600">
          Store your company details for reuse across multiple tenders.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="company_name">Company name</label>
            <input
              id="company_name"
              value={profile.company_name}
              onChange={(event) => handleChange("company_name", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="registration_number">Registration number</label>
            <input
              id="registration_number"
              value={profile.registration_number ?? ""}
              onChange={(event) => handleChange("registration_number", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="vat_number">VAT number</label>
            <input
              id="vat_number"
              value={profile.vat_number ?? ""}
              onChange={(event) => handleChange("vat_number", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="tax_pin">Tax compliance PIN</label>
            <input
              id="tax_pin"
              value={profile.tax_pin ?? ""}
              onChange={(event) => handleChange("tax_pin", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="csd_number">CSD number</label>
            <input
              id="csd_number"
              value={profile.csd_number ?? ""}
              onChange={(event) => handleChange("csd_number", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="physical_address">Physical address</label>
            <input
              id="physical_address"
              value={profile.physical_address ?? ""}
              onChange={(event) => handleChange("physical_address", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="postal_address">Postal address</label>
            <input
              id="postal_address"
              value={profile.postal_address ?? ""}
              onChange={(event) => handleChange("postal_address", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={profile.email ?? ""}
              onChange={(event) => handleChange("email", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={profile.phone ?? ""}
              onChange={(event) => handleChange("phone", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="cellphone">Cellphone</label>
            <input
              id="cellphone"
              value={profile.cellphone ?? ""}
              onChange={(event) => handleChange("cellphone", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="signatory_name">Signatory name</label>
            <input
              id="signatory_name"
              value={profile.signatory_name ?? ""}
              onChange={(event) => handleChange("signatory_name", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="signatory_id_number">Signatory ID number</label>
            <input
              id="signatory_id_number"
              value={profile.signatory_id_number ?? ""}
              onChange={(event) => handleChange("signatory_id_number", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="signatory_title">Signatory title</label>
            <input
              id="signatory_title"
              value={profile.signatory_title ?? ""}
              onChange={(event) => handleChange("signatory_title", event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(profile.is_foreign_supplier)}
              onChange={(event) => handleChange("is_foreign_supplier", event.target.checked)}
            />
            Foreign supplier
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(profile.is_accredited_rep)}
              onChange={(event) => handleChange("is_accredited_rep", event.target.checked)}
            />
            Accredited representative
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
          >
            Save profile
          </button>
          {status && <span className="text-sm text-slate-600">{status}</span>}
        </div>
      </form>
    </section>
  );
}
