import React, { useEffect, useState } from 'react';

/**
 * Exemple d'utilisation de l'API Electron
 * Ce fichier montre comment utiliser la base de données et les fichiers
 */

export function DatabaseExample() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ============================================
  // Récupérer les workers
  // ============================================
  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const result = await window.electron.db.workers.getAll();
      if (result.success) {
        setWorkers(result.data);
        console.log('✅ Workers:', result.data);
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Ajouter un worker
  // ============================================
  const addWorker = async () => {
    const newWorker = {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '0612345678',
      status: 'actif',
    };

    try {
      const result = await window.electron.db.workers.add(newWorker);
      if (result.success) {
        console.log('✅ Worker ajouté avec l\'ID:', result.id);
        fetchWorkers(); // Recharger la liste
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ============================================
  // Modifier un worker
  // ============================================
  const updateWorker = async (id: number) => {
    const updatedWorker = {
      name: 'Jean Dupont Modifié',
      email: 'jean.new@example.com',
      phone: '0687654321',
      status: 'inactif',
    };

    try {
      const result = await window.electron.db.workers.update(id, updatedWorker);
      if (result.success) {
        console.log('✅ Worker modifié');
        fetchWorkers(); // Recharger la liste
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ============================================
  // Supprimer un worker
  // ============================================
  const deleteWorker = async (id: number) => {
    try {
      const result = await window.electron.db.workers.delete(id);
      if (result.success) {
        console.log('✅ Worker supprimé');
        fetchWorkers(); // Recharger la liste
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ============================================
  // Récupérer les tâches
  // ============================================
  const fetchTasks = async (workerId?: number) => {
    setLoading(true);
    try {
      const result = await window.electron.db.tasks.getAll(workerId);
      if (result.success) {
        setTasks(result.data);
        console.log('✅ Tasks:', result.data);
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Ajouter une tâche
  // ============================================
  const addTask = async (workerId: number) => {
    const newTask = {
      workerId,
      title: 'Nouvelle tâche',
      description: 'Description de la tâche',
      status: 'en attente',
      dueDate: new Date().toISOString(),
    };

    try {
      const result = await window.electron.db.tasks.add(newTask);
      if (result.success) {
        console.log('✅ Tâche ajoutée avec l\'ID:', result.id);
        fetchTasks(); // Recharger la liste
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ============================================
  // Obtenir les statistiques
  // ============================================
  const getStats = async () => {
    try {
      const result = await window.electron.db.stats();
      if (result.success) {
        setStats(result.data);
        console.log('📊 Statistiques:', result.data);
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ============================================
  // Exporter la base de données
  // ============================================
  const exportDatabase = async () => {
    try {
      const result = await window.electron.db.export();
      if (result.success) {
        console.log('✅', result.message);
        alert(result.message);
      } else {
        console.error('❌', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ============================================
  // Importer la base de données
  // ============================================
  const importDatabase = async () => {
    try {
      const result = await window.electron.db.import();
      if (result.success) {
        console.log('✅', result.message);
        alert(result.message);
        fetchWorkers(); // Recharger les données
      } else {
        console.error('❌', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ============================================
  // Lire un fichier
  // ============================================
  const readFile = async () => {
    try {
      const result = await window.electron.file.openDialog({
        properties: ['openFile'],
        filters: [{ name: 'All Files', extensions: ['*'] }],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const fileContent = await window.electron.file.read(filePath);
        
        if (fileContent.success) {
          console.log('📄 Contenu du fichier:', fileContent.data);
          alert('Fichier lu avec succès! Voir la console.');
        } else {
          console.error('❌ Erreur:', fileContent.error);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ============================================
  // Écrire dans un fichier
  // ============================================
  const writeFile = async () => {
    try {
      const filePath = `${new Date().toISOString()}-export.txt`;
      const content = JSON.stringify(workers, null, 2);
      
      const result = await window.electron.file.write(filePath, content);
      if (result.success) {
        console.log('✅ Fichier écrit:', filePath);
        alert('Fichier créé avec succès!');
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchWorkers();
    getStats();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">💾 Exemple de Base de Données</h1>

      {/* Statistiques */}
      {stats && (
        <div className="bg-blue-50 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Statistiques</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded">
              <div className="text-2xl font-bold text-blue-600">{stats.workers}</div>
              <div className="text-gray-600">Workers</div>
            </div>
            <div className="bg-white p-4 rounded">
              <div className="text-2xl font-bold text-green-600">{stats.tasks}</div>
              <div className="text-gray-600">Tasks</div>
            </div>
            <div className="bg-white p-4 rounded">
              <div className="text-2xl font-bold text-purple-600">{stats.logs}</div>
              <div className="text-gray-600">Logs</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            DB Path: {stats.dbPath}
          </p>
        </div>
      )}

      {/* Boutons d'actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={fetchWorkers}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? '⏳ Chargement...' : '🔄 Charger Workers'}
        </button>
        <button
          onClick={addWorker}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          ➕ Ajouter Worker
        </button>
        <button
          onClick={exportDatabase}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
        >
          📥 Exporter BD
        </button>
        <button
          onClick={importDatabase}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
        >
          📤 Importer BD
        </button>
        <button
          onClick={readFile}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
        >
          📖 Lire Fichier
        </button>
        <button
          onClick={writeFile}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
        >
          ✍️ Écrire Fichier
        </button>
      </div>

      {/* Liste des workers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">👥 Workers</h2>
        {workers.length === 0 ? (
          <p className="text-gray-500">Aucun worker trouvé</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Nom</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Téléphone</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{worker.id}</td>
                  <td className="py-2">{worker.name}</td>
                  <td className="py-2">{worker.email}</td>
                  <td className="py-2">{worker.phone}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      worker.status === 'actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="py-2 space-x-2">
                    <button
                      onClick={() => updateWorker(worker.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => deleteWorker(worker.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      🗑️ Supprimer
                    </button>
                    <button
                      onClick={() => {
                        fetchTasks(worker.id);
                        addTask(worker.id);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      ➕ Tâche
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Console simulée */}
      <div className="mt-8 bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
        <p className="text-yellow-400">💡 Ouvrez la console (F12) pour voir les détails des opérations</p>
      </div>
    </div>
  );
}

export default DatabaseExample;
