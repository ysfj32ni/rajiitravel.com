import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Trip, TripFormData } from "../types";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Banknote,
  Image as ImageIcon,
  FileText,
  Users,
  Star,
} from "lucide-react";
import PartnersManagement from "../components/PartnersManagement";
import TripDeparturesManagement from "../components/TripDeparturesManagement";
import TestimonialsManagement from "../components/TestimonialsManagement";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "trips" | "partners" | "testimonials"
  >("trips");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [managingDeparturesTrip, setManagingDeparturesTrip] =
    useState<Trip | null>(null);

  // Form state
  const [formData, setFormData] = useState<TripFormData>({
    title: "",
    price: 0,
    date: "",
    description: "",
    image_url: "",
    program: "",
    is_completed: false,
  });

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTrips(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingTrip ? "updating" : "creating";

    try {
      if (editingTrip) {
        const { error } = await supabase
          .from("trips")
          .update(formData)
          .eq("id", editingTrip.id);
        if (error) throw error;
        toast.success("Trip updated successfully");
      } else {
        const { error } = await supabase.from("trips").insert([formData]);
        if (error) throw error;
        toast.success("Trip created successfully");
      }

      setIsFormOpen(false);
      setEditingTrip(null);
      setFormData({
        title: "",
        price: 0,
        date: "",
        description: "",
        image_url: "",
        program: "",
        is_completed: false,
      });
      fetchTrips();
    } catch (err: any) {
      toast.error(`Error ${action} trip: ` + err.message);
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      title: trip.title,
      price: trip.price,
      date: trip.date,
      description: trip.description,
      image_url: trip.image_url,
      program: trip.program || "",
      is_completed: trip.is_completed,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;
      toast.success("Trip deleted");
      fetchTrips();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const toggleStatus = async (trip: Trip) => {
    try {
      const { error } = await supabase
        .from("trips")
        .update({ is_completed: !trip.is_completed })
        .eq("id", trip.id);
      if (error) throw error;
      toast.success(
        `Trip marked as ${!trip.is_completed ? "Completed" : "Upcoming"}`,
      );
      fetchTrips();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">
              Manage your website content and settings
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab("trips")}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "trips"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Calendar size={20} />
            <span>Trips</span>
          </button>
          <button
            onClick={() => setActiveTab("partners")}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "partners"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users size={20} />
            <span>Partners</span>
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "testimonials"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Star size={20} />
            <span>Testimonials</span>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "trips" ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Trips Management
                </h2>
                <p className="text-gray-500">
                  Manage your travel catalog, prices, and status.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingTrip(null);
                  setFormData({
                    title: "",
                    price: 0,
                    date: "",
                    description: "",
                    image_url: "",
                    program: "",
                    is_completed: false,
                  });
                  setIsFormOpen(true);
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition-all"
              >
                <Plus size={20} />
                Add New Trip
              </button>
            </div>

            {/* Modal for Managing Departure Dates */}
            {managingDeparturesTrip && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Manage Departure Dates
                      </h2>
                      <button
                        onClick={() => setManagingDeparturesTrip(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>
                    <TripDeparturesManagement
                      tripId={managingDeparturesTrip.id}
                      tripTitle={managingDeparturesTrip.title}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Add/Edit */}
            {isFormOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {editingTrip ? "Edit Trip" : "Create New Trip"}
                      </h2>
                      <button
                        onClick={() => setIsFormOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Trip Title
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                            placeholder="e.g., Luxury Maldives Escape"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <Banknote size={14} /> Price (MAD)
                          </label>
                          <input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                            placeholder="e.g., 2500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <Calendar size={14} /> Date
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                          />
                        </div>
                        <div className="col-span-full">
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <ImageIcon size={14} /> Image URL
                          </label>
                          <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                image_url: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                        <div className="col-span-full">
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <FileText size={14} /> Description
                          </label>
                          <textarea
                            rows={4}
                            required
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none resize-none"
                          ></textarea>
                        </div>
                        <div className="col-span-full">
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <FileText size={14} /> Travel Program (Day-by-day
                            itinerary)
                          </label>
                          <textarea
                            rows={12}
                            value={formData.program || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                program: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none resize-y font-mono text-sm"
                            placeholder="⬅️ الجمعة&#10;&#10;-- 17:00 : الإنطلاق من الرباط...&#10;-- 19:30 : الإنطلاق من الدار البيضاء...&#10;&#10;⬅️ السبت&#10;&#10;-- الإستيقاظ و تناول وجبة الفطور..."
                            dir="rtl"
                          ></textarea>
                          <p className="text-xs text-gray-500 mt-1">
                            يمكنك استخدام الرموز التعبيرية والتنسيق لجعل
                            البرنامج أكثر جاذبية
                          </p>
                        </div>
                        <div className="col-span-full flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="is_completed"
                            checked={formData.is_completed}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                is_completed: e.target.checked,
                              })
                            }
                            className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500"
                          />
                          <label
                            htmlFor="is_completed"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Mark as Completed (Move to History)
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="flex-grow bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all"
                        >
                          {editingTrip ? "Update Trip" : "Create Trip"}
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
              </div>
            )}

            {/* Trips Table/List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center">
                  <Loader2
                    className="animate-spin text-orange-600 mb-4"
                    size={40}
                  />
                  <p className="text-gray-500">Loading your trips...</p>
                </div>
              ) : trips.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <th className="px-6 py-4 font-bold">Trip</th>
                        <th className="px-6 py-4 font-bold">Price</th>
                        <th className="px-6 py-4 font-bold">Date</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trips.map((trip) => (
                        <tr
                          key={trip.id}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  trip.image_url ||
                                  "https://picsum.photos/seed/travel/100/100"
                                }
                                alt={trip.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-bold text-gray-900">
                                  {trip.title}
                                </div>
                                <div className="text-xs text-gray-400 max-w-[200px] truncate">
                                  {trip.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-orange-600">
                              {trip.price} MAD
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {/* Force Western numerals for the admin dashboard */}
                            {new Date(trip.date).toLocaleDateString("en-US")}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleStatus(trip)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                trip.is_completed
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              }`}
                            >
                              {trip.is_completed ? (
                                <CheckCircle size={14} />
                              ) : (
                                <Calendar size={14} />
                              )}
                              {trip.is_completed ? "Completed" : "Upcoming"}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setManagingDeparturesTrip(trip)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Manage Dates"
                              >
                                <Calendar size={18} />
                              </button>
                              <button
                                onClick={() => handleEdit(trip)}
                                className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(trip.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center">
                  <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    No trips yet
                  </h3>
                  <p className="text-gray-500">
                    Create your first trip to see it listed here.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : activeTab === "partners" ? (
          <PartnersManagement />
        ) : (
          <TestimonialsManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
