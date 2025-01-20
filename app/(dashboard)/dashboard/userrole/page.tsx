'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, PlusCircle } from 'lucide-react';

interface User {
  id: number;
  name: string | null;
}

interface CariRole {
  id: number;
  userId: number;
  userName?: string;
  netsisCariKod: string;
  userRole: string;
}

export default function UserRolePage() {
  const [userRoles, setUserRoles] = useState<CariRole[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [newRole, setNewRole] = useState({ userId: '', netsisCariKod: '', userRole: 'member' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/pages/userroles');
        const data = await response.json();
        setUserRoles(data.roles);
        setUsersList(data.users);
        setLoading(false);
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddRole = async () => {
    if (!newRole.userId || !newRole.netsisCariKod.trim()) {
      setError('Tüm alanları doldurun.');
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch('/api/pages/userroles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || 'Rol eklenirken bir hata oluştu.');
        setLoading(false);
        return;
      }
  
      setUserRoles(data.roles);
      setNewRole({ userId: '', netsisCariKod: '', userRole: 'member' });
      setLoading(false);
    } catch (err) {
      setError('Rol eklenirken bir hata oluştu.');
      setLoading(false);
    }
  };
  

  const handleDeleteRole = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages/userroles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      setUserRoles(data.roles);
      setLoading(false);
    } catch (err) {
      setError('Rol silinirken bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Kullanıcı Rollerini Yönet</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Role Form */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
            Kullanıcı
          </label>
          <select
            id="userId"
            value={newRole.userId}
            onChange={(e) => setNewRole({ ...newRole, userId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seçiniz</option>
            {usersList.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || `Kullanıcı #${user.id}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="netsisCariKod" className="block text-sm font-medium text-gray-700">
            Netsis Cari Kod
          </label>
          <Input
            id="netsisCariKod"
            value={newRole.netsisCariKod}
            onChange={(e) => setNewRole({ ...newRole, netsisCariKod: e.target.value })}
            placeholder="Netsis cari kodu"
          />
        </div>
        <div>
          <label htmlFor="userRole" className="block text-sm font-medium text-gray-700">
            Rol
          </label>
          <select
            id="userRole"
            value={newRole.userRole}
            onChange={(e) => setNewRole({ ...newRole, userRole: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="member">Üye</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <Button
            onClick={handleAddRole}
            className="w-full bg-blue-500 text-white flex items-center justify-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Ekle
          </Button>
        </div>
      </div>

      {/* Roles List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Kullanıcı</th>
              <th className="py-2 px-4 border-b">Netsis Cari Kod</th>
              <th className="py-2 px-4 border-b">Rol</th>
              <th className="py-2 px-4 border-b">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {userRoles.map((role) => (
              <tr key={role.id}>
                <td className="py-2 px-4 border-b">{role.id}</td>
                <td className="py-2 px-4 border-b">{role.userName || `Kullanıcı #${role.userId}`}</td>
                <td className="py-2 px-4 border-b">{role.netsisCariKod}</td>
                <td className="py-2 px-4 border-b">{role.userRole}</td>
                <td className="py-2 px-4 border-b">
                  <Button
                    onClick={() => handleDeleteRole(role.id)}
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash className="mr-2 h-5 w-5" />
                    Sil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
