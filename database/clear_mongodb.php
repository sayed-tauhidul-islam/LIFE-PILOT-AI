<?php
/**
 * MongoDB Cleanup Script
 * Run: php database/clear_mongodb.php
 * This drops ALL databases from MongoDB
 */

try {
    $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
    
    // List all databases
    $databases = $manager->executeCommand('admin', new MongoDB\Driver\Command(['listDatabases' => 1]));
    
    echo "=== MongoDB Cleanup Started ===\n\n";
    
    foreach ($databases->toArray()[0]->databases as $db) {
        $dbName = $db->name;
        // Skip system databases
        if (in_array($dbName, ['admin', 'local', 'config'])) {
            echo "Skipping system database: $dbName\n";
            continue;
        }
        
        $command = new MongoDB\Driver\Command(['dropDatabase' => 1]);
        $manager->executeCommand($dbName, $command);
        echo "Dropped database: $dbName\n";
    }
    
    echo "\n=== All user databases deleted successfully! ===\n";
    echo "MongoDB is now clean.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Make sure MongoDB extension is installed and MongoDB is running.\n";
}

