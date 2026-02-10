
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Partner, PartnerFormData } from '../types';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, ArrowUp, ArrowDown, XCircle } from 'lucide-react';

const PartnersManagement: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    logo_url: '',
    display_order: 0
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setPartners(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPartner) {
        const { error } = await supabase
          .from('partners')
          .update(formData)
          .eq('id', editingPartner.id);
        if (error) throw error;
        toast.success('Partner updated successfully');
      } else {
        // Get the max display_order and add 1
        const maxOrder = partners.length > 0 ? Math.max(...partners.map(p => p.display_order)) : 0;
        const { error } = await supabase
          .from('partners')
          .insert([{ ...formData, display_order: maxOrder + 1 }]);
        if (error) throw error;
        toast.success('Partner added successfully');
      }
      
      setIsFormOpen(false);
      setEditingPartner(null);
      setFormData({ name: '', logo_url: '', display_order: 0 });
      fetchPartners();
    } catch (err: any) {
      toast.error('Error saving partner: ' + err.message);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
      display_order: partner.display_order
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    
    try {
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) throw error;
      toast.success('Partner deleted');
      fetchPartners();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const movePartner = async (partner: Partner, direction: 'up' | 'down') => {
    const currentIndex = partners.findIndex(p => p.id === partner.id);
    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === partners.length - 1)) {
      return;
    }

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapPartner = partners[swapIndex];

    try {
      // Swap display orders
      await supabase.from('partners').update({ display_order: swapPartner.display_order }).eq('id', partner.id);
      await supabase.from('partners').update({ display_order: partner.display_order }).eq('id', swapPartner.id);
      toast.success('Order updated');
      fetchPartners();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Partners Management</h2>
          <p className="text-gray-500">Manage client logos displayed on your website</p>
        </div>
        <button 
          onClick={() => { setIsFormOpen(true); setEditingPartner(null); setFormData({ name: '', logo_url: '', display_order: 0 }); }}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition-all"
        >
          <Plus size={20} />
          <span>Add Partner</span>
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{editingPartner ? 'Edit Partner' : 'Add New Partner'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Partner Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                  placeholder="e.g., Royal Air Maroc"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <ImageIcon size={14} /> Logo URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.logo_url}
                  onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                  placeholder="https://example.com/logo.png"
                />
                {formData.logo_url && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img src={formData.logo_url} alt="Preview" className="max-h-20 object-contain" />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-grow bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  {editingPartner ? 'Update Partner' : 'Add Partner'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partners List */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
          <p className="text-gray-500">Loading partners...</p>
        </div>
      ) : partners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <div key={partner.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-400">#{partner.display_order}</span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => movePartner(partner, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    onClick={() => movePartner(partner, 'down')}
                    disabled={index === partners.length - 1}
                    className="p-1 text-gray-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 mb-4 h-24 flex items-center justify-center">
                <img 
                  src={partner.logo_url} 
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-center">{partner.name}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(partner)}
                  className="flex-1 p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all text-sm font-medium"
                >
                  <Edit2 size={16} className="inline mr-1" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(partner.id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
                >
                  <Trash2 size={16} className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p>No partners added yet. Click "Add Partner" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default PartnersManagement;
