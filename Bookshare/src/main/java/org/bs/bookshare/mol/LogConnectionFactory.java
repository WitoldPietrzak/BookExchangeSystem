package org.bs.bookshare.mol;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.commons.dbcp2.ConnectionFactory;
import org.apache.commons.dbcp2.DriverManagerConnectionFactory;
import org.apache.commons.dbcp2.PoolableConnection;
import org.apache.commons.dbcp2.PoolableConnectionFactory;
import org.apache.commons.dbcp2.PoolingDataSource;
import org.apache.commons.pool2.ObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.bs.bookshare.utils.PropertiesLoader;

public class LogConnectionFactory {

    private static interface Singleton {
        final LogConnectionFactory INSTANCE = new LogConnectionFactory();
    }

    private DataSource dataSource;

    private LogConnectionFactory() {

    }

    private void initDataSource() throws IOException {
        Properties properties = PropertiesLoader.loadProperties("application.properties");

        try {
            ConnectionFactory connectionFactory = new DriverManagerConnectionFactory(properties.getProperty("spring.datasource.url"),
                    properties.getProperty("spring.datasource.username"), properties.getProperty("spring.datasource.password"));

            PoolableConnectionFactory poolableConnectionFactory = new PoolableConnectionFactory(connectionFactory,
                    null);
            ObjectPool<PoolableConnection> connectionPool = new GenericObjectPool<>(poolableConnectionFactory);

            // Set the factory's pool property to the owning pool
            poolableConnectionFactory.setPool(connectionPool);

            dataSource = new PoolingDataSource<>(connectionPool);
        } catch (Exception e) {
            e.printStackTrace();  //TODO
            dataSource = null;
        }

    }

    int i = 0;
    private static Lock lock = new ReentrantLock();

    public static Connection getDatabaseConnection() throws SQLException, IOException {
        Properties properties = PropertiesLoader.loadProperties("application.properties");


        if (Singleton.INSTANCE.i == 0) {
            Singleton.INSTANCE.i++;
            return DriverManager.getConnection(properties.getProperty("spring.datasource.url"),
                    properties.getProperty("spring.datasource.username"), properties.getProperty("spring.datasource.password"));

        }
        if (Singleton.INSTANCE.dataSource == null) {
            lock.lock();
            try {
                if (Singleton.INSTANCE.dataSource == null) {
                    Singleton.INSTANCE.initDataSource();
                }
            } finally {
                lock.unlock();
            }
        }
        return Singleton.INSTANCE.dataSource.getConnection();
    }
}