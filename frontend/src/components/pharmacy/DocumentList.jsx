// frontend/src/components/pharmacy/DocumentList.jsx
import React from 'react';
import { documentService } from '../../services/documentService';
import { formatters } from '../../utils/formatters';
import '../../styles/DocumentList.css';

export const DocumentList = ({ documents, onRefresh, loading }) => {
  const handleDownload = async (documentId, filename) => {
    try {
      const blob = await documentService.download(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du document');
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      await documentService.delete(documentId);
      alert('Document supprimé avec succès');
      onRefresh();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du document');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" className="empty-icon">
          <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
        <p>Aucun document reçu pour le moment</p>
      </div>
    );
  }

  return (
    <div className="document-list">
      <table className="documents-table">
        <thead>
          <tr>
            <th>Nom du fichier</th>
            <th>Taille</th>
            <th>Date d'envoi</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className={doc.is_viewed ? 'viewed' : 'new'}>
              <td>
                <div className="filename-cell">
                  <span className="file-icon">📄</span>
                  <span className="filename">{doc.original_filename}</span>
                  {!doc.is_viewed && <span className="badge-new">Nouveau</span>}
                </div>
              </td>
              <td>{formatters.fileSize(doc.file_size)}</td>
              <td>{formatters.date(doc.uploaded_at)}</td>
              <td>
                <span className={`status-badge ${doc.is_viewed ? 'viewed' : 'unread'}`}>
                  {doc.is_viewed ? 'Lu' : 'Non lu'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleDownload(doc.id, doc.original_filename)}
                    className="btn-icon btn-download"
                    title="Télécharger"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="btn-icon btn-delete"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};