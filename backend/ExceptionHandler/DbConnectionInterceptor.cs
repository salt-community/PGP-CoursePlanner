using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;

public class DbIntercept : DbConnectionInterceptor
{
    public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
    {
        Console.WriteLine($"[DbConnection] Opened: {connection.ConnectionString}");
        base.ConnectionOpened(connection, eventData);
    }

    public override void ConnectionClosed(DbConnection connection, ConnectionEndEventData eventData)
    {
        Console.WriteLine($"[DbConnection] Closed: {connection.ConnectionString}");
        base.ConnectionClosed(connection, eventData);
    }
}