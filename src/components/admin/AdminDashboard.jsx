import React from 'react'
import AdminTable from '../features/Table'
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useMutation } from '@tanstack/react-query';
import { deleteNews, queryClient } from '../../utils/htttps';
import { useState } from 'react';
import AlertDialog from '../features/Dialog';
import AddNews from '../features/AddNews';

export default function AdminDashboard() {
  const [open, setIsOpen] = useState(false);
  const [openAddNews, isOpenAddNews] = useState(false)
  const [selectedNewsId, setSelectedNewsId] = useState(null); // Store selected news ID

  const { mutate } = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries('news-list');
      setIsOpen(false); // Close dialog after deletion
    },
    onError: (error) => {
      console.error('Error deleting news:', error);
    },
  });

  // Handle delete button click (show confirmation dialog)
  const handleDeleteClick = (id) => {
    setSelectedNewsId(id); // Store the selected news ID
    setIsOpen(true); // Open the dialog
  };

  // Handle confirmation (delete the news)
  const handleConfirmDelete = () => {
    if (selectedNewsId) {
      mutate({ id: selectedNewsId }); // Execute deletion
      setSelectedNewsId(null); // Reset ID
      setIsOpen(false)
    }
  };

  const handleOpenAddNews = () => {
      isOpenAddNews(true)
  }
  const handleCloseAddNews = () => {
    isOpenAddNews(false)
}
  return (
    <>
    <AddNews open={openAddNews} onClose={handleCloseAddNews}/>
      <header>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              ADMIN DASHBOARD
            </Typography>
             {/* Add Button */}
             <Button 
                    variant="contained" 
                    color="info" 
                    startIcon={<AddIcon />} 
                    sx={{ ml: 2 }} 
                    onClick={handleOpenAddNews}
                    >
                    Add
                  </Button>
          </Toolbar>
        </AppBar>
      </header>
      <main>
        <AdminTable handleDeleteClick={handleDeleteClick} />
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={open} 
        onClose={() => setIsOpen(false)} 
        onConfirm={handleConfirmDelete} // Call confirm function on OK
        description= " Are you sure you want to delete this news item? This action cannot be undone."
        title= "Confirm Deletion"
      />
    </>
  );
}
