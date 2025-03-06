import * as React from "react";
//import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from '@tanstack/react-query';
import { getNews } from '../../utils/htttps';
import AlertDialog from "./Dialog";

export default function AdminTable({ handleDeleteClick }) {
  const { data } = useQuery({
    queryKey: ['news-list'],
    queryFn: ({ signal }) => getNews({ signal }),
  });



    //format date to readable format
    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric',  hour: 'numeric',  minute: 'numeric', hour12: true,} 
      return new Date(date).toLocaleDateString("en-PH", options)
    } 

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data?.news || []).map((news) => (
            <TableRow key={news._id}>
              <TableCell>{news.title}</TableCell>
              <TableCell align="center">{news.cathegory}</TableCell>
              <TableCell align="center">{formatDate(news.createdAt)}</TableCell>
              <TableCell align="center">
                <IconButton color="error" onClick={() => handleDeleteClick(news._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}