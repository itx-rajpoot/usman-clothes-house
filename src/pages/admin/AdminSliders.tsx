
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface SliderImage {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

const AdminSliders = () => {
  const { toast } = useToast();
  const [sliders, setSliders] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<SliderImage | null>(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    subtitle: ''
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'sliders'));
      const sliderList: SliderImage[] = [];
      querySnapshot.forEach((doc) => {
        sliderList.push({ id: doc.id, ...doc.data() } as SliderImage);
      });
      setSliders(sliderList);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSlider) {
        await updateDoc(doc(db, 'sliders', editingSlider.id), formData);
        toast({
          title: "Slider Updated!",
          description: "Slider has been updated successfully.",
        });
      } else {
        await addDoc(collection(db, 'sliders'), formData);
        toast({
          title: "Slider Added!",
          description: "New slider has been added successfully.",
        });
      }

      setDialogOpen(false);
      setEditingSlider(null);
      setFormData({
        imageUrl: '',
        title: '',
        subtitle: ''
      });
      fetchSliders();
    } catch (error) {
      console.error('Error saving slider:', error);
      toast({
        title: "Error",
        description: "Failed to save slider. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (slider: SliderImage) => {
    setEditingSlider(slider);
    setFormData({
      imageUrl: slider.imageUrl,
      title: slider.title,
      subtitle: slider.subtitle
    });
    setDialogOpen(true);
  };

  const handleDelete = async (sliderId: string) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        await deleteDoc(doc(db, 'sliders', sliderId));
        toast({
          title: "Slider Deleted!",
          description: "Slider has been deleted successfully.",
        });
        fetchSliders();
      } catch (error) {
        console.error('Error deleting slider:', error);
        toast({
          title: "Error",
          description: "Failed to delete slider. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setEditingSlider(null);
    setFormData({
      imageUrl: '',
      title: '',
      subtitle: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/admin" className="mr-4">
                <Button variant="outline" className="text-amber-600 border-white hover:bg-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Manage Sliders</h1>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-amber-600 border-white hover:bg-white"
                  onClick={resetForm}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slider
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSlider ? 'Edit Slider' : 'Add New Slider'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl">Image URL *</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Main title for the slider"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subtitle">Subtitle *</Label>
                    <Input
                      id="subtitle"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      required
                      placeholder="Subtitle or description"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                    {editingSlider ? 'Update Slider' : 'Add Slider'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider) => (
            <Card key={slider.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={slider.imageUrl}
                    alt={slider.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <h3 className="text-lg font-bold mb-2">{slider.title}</h3>
                      <p className="text-sm">{slider.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(slider)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(slider.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sliders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sliders found. Add your first slider!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSliders;
