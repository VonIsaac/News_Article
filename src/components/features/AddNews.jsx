import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { postNews, queryClient } from "../../utils/htttps";


export default function AddNews({open, onClose}) {
    //const [open, setIsOpen] = useState(false) // handle the open the modal
    const [form, setFormData] = useState({
        title: "",
        text: "",
        cathegory: "",
        author: "",
        source: "",
        images: "",
        tags: "", // Fix: Initialize as an empty array
    })

    // function to post a data
    const {mutate, isPending} = useMutation({
        mutationFn: postNews,
        onSuccess: () => {
            
            queryClient.invalidateQueries('news-list')
            setFormData({
                title: "",
                text: "",
                cathegory: "",
                author: "",
                source: "",
                images: "",
                tags: "",
            })
            onClose()
        },
        onError: (err) => {
            console.error("Error:", err);
            alert("Error submitting news.");
        }
    })

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target; // create a obj variable 
    setFormData({
      ...form, // spreeding all data
      [name]: value, // obj key
    });
  };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Convert comma-separated string into an array
        const tagsArray = form.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== ""); 
    
        const newsData = {
          ...form,
          tags: tagsArray, // Ensure tags are an array of strings
        };
    
        console.log("Submitting data:", newsData);
        mutate(newsData);
      };
    

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add News</DialogTitle>
      <DialogContent>
        {/* Form wrapper to ensure submit button works */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} required fullWidth />
          <TextField label="Text" name="text" value={form.text} onChange={handleChange} required fullWidth multiline rows={3} />
          <TextField label="Category" name="cathegory" value={form.cathegory} onChange={handleChange} required fullWidth />
          <TextField label="Author" name="author" value={form.author} onChange={handleChange} required fullWidth />
          <TextField label="Source" name="source" value={form.source} onChange={handleChange} required fullWidth />
          <TextField label="Image URL" name="images" value={form.images} onChange={handleChange} required fullWidth />
         <TextField label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} required fullWidth />

          {/* Submit button should be inside the form */}
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}


