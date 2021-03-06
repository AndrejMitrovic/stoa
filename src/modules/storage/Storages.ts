/*******************************************************************************

    The superclass of storages.

    This has a DB instance.

    Copyright:
        Copyright (c) 2020 BOS Platform Foundation Korea
        All rights reserved.

    License:
        MIT License. See LICENSE for details.

*******************************************************************************/

import * as sqlite from 'sqlite3';

export class Storages
{
    /**
     *  The instance of sqlite
     */
    protected db: sqlite.Database;

    /**
     * Constructor
     * @param filename Valid values are filenames,
     * ":memory:" for an anonymous in-memory database and
     * an empty string for an anonymous disk-based database
     */
    constructor (filename: string, callback: (err: Error | null) => void)
    {
        this.db = new sqlite.Database(filename,
            sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE |
            sqlite.OPEN_SHAREDCACHE, (err: Error | null) =>
            {
                if (err != null)
                    callback(err);

                this.db.configure("busyTimeout", 1000);
                this.createTables((err: Error | null) => {
                    if (callback != null)
                        callback(err);
                });
            });
    }

    /**
     * Creates tables.
     * @param callback If provided, this function will be called when
     * the database was finished successfully or when an error occurred.
     * The first argument is an error object.
     */
    public createTables (callback: (err: Error | null) => void)
    {
    }

    /**
     * Close the database
     */
    public close ()
    {
        this.db.close();
    }
}
