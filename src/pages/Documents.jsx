import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

const Documents = () => {
  const { documents, addDocument, updateDocument } = useDataStore();
  const [sortBy, setSortBy] = useState('date');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    importedOn: new Date().toISOString().slice(0, 10),
  });

  // Sort documents
  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.importedOn) - new Date(a.importedOn);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Documents</h1>
          <div className="flex space-x-4">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-lg ${
                  sortBy === 'date' ? 'bg-white shadow' : ''
                }`}
                onClick={() => setSortBy('date')}
              >
                Sort by Date
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  sortBy === 'title' ? 'bg-white shadow' : ''
                }`}
                onClick={() => setSortBy('title')}
              >
                Sort by Title
              </button>
            </div>
            <Button
              className="px-4"
              variant="default"
              onClick={() => setIsUploadOpen(true)}
            >
              Upload Document
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDocuments.map((document) => (
            <div
              key={document.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
                <h3 className="text-lg font-medium text-gray-900">
                  {document.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Imported: {new Date(document.importedOn).toLocaleDateString()}
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <svg
                    className="h-12 w-12 text-purple-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-4">
                    <p className="text-sm text-gray-700">
                      {document.sentToClient ? (
                        <span className="text-green-600">Sent to client</span>
                      ) : (
                        <span className="text-gray-500">Not sent</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="link"
                    className="text-purple-800 hover:text-purple-900"
                    onClick={() => alert(`Viewing ${document.title}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="link"
                    className="text-purple-800 hover:text-purple-900"
                    onClick={() => alert(`Printing ${document.title}`)}
                  >
                    Print
                  </Button>
                  {!document.sentToClient && (
                    <Button
                      variant="link"
                      className="text-purple-800 hover:text-purple-900"
                      onClick={() =>
                        updateDocument(document.id, {
                          sentToClient: true,
                        })
                      }
                    >
                      Send to Client
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Document"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={newDocument.title}
              onChange={(e) =>
                setNewDocument({ ...newDocument, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Imported On
            </label>
            <Input
              type="date"
              value={newDocument.importedOn}
              onChange={(e) =>
                setNewDocument({
                  ...newDocument,
                  importedOn: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newDocument.title) return;
                addDocument({
                  title: newDocument.title,
                  importedOn: newDocument.importedOn,
                  sentToClient: false,
                });
                setIsUploadOpen(false);
                setNewDocument({
                  title: '',
                  importedOn: new Date().toISOString().slice(0, 10),
                });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Documents;
