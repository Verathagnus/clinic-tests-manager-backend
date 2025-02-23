// src/seed/seed.service.ts
import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';

@Injectable()
export class SeedService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) { }

  async seed() {
    try {
      await this.createTables();

      const itemGroups = [
        { name: 'Haematology' },
        { name: 'Biochemistry' },
        { name: 'Serology' },
        { name: 'Stool' },
        { name: 'Hormone Assays' },
        { name: 'Histopathology' },
        { name: 'Urine' },
        { name: 'Semen' },
      ];

      const items = [
        { name: 'Blood Test', price: 1300, group: 'Haematology' },
        { name: 'Hb%', price: 100, group: 'Haematology' },
        { name: 'TC of WBC', price: 100, group: 'Haematology' },
        { name: 'DLC', price: 100, group: 'Haematology' },
        { name: 'ESR', price: 100, group: 'Haematology' },
        { name: 'CBC', price: 500, group: 'Haematology' },
        { name: 'PBF', price: 150, group: 'Haematology' },
        { name: 'HbA1c', price: 600, group: 'Haematology' },
        { name: 'AEC', price: 150, group: 'Haematology' },
        { name: 'Platelet Count', price: 150, group: 'Haematology' },
        { name: 'BT', price: 40, group: 'Haematology' },
        { name: 'CT', price: 40, group: 'Haematology' },
        { name: 'Blood Group', price: 80, group: 'Haematology' },
        { name: 'Bone Marrow Aspiration', price: 3500, group: 'Haematology' },
        { name: 'Malarial Parasite', price: 150, group: 'Haematology' },
        { name: 'Blood Sugar (RBS, FBS, PPBS)', price: 70, group: 'Biochemistry' },
        { name: 'Sr. Bilirubin fraction', price: 250, group: 'Biochemistry' },
        { name: 'Sr. Urea', price: 150, group: 'Biochemistry' },
        { name: 'Sr. Creatinine', price: 150, group: 'Biochemistry' },
        { name: 'Sr. Uric Acid', price: 150, group: 'Biochemistry' },
        { name: 'Sr. Amylase', price: 350, group: 'Biochemistry' },
        { name: 'Sr. Lipase', price: 650, group: 'Biochemistry' },
        { name: 'RA factor', price: 350, group: 'Biochemistry' },
        { name: 'LFT', price: 1000, group: 'Biochemistry' },
        { name: 'Lipid Profile', price: 750, group: 'Biochemistry' },
        { name: 'Virology Profile (HIV/HCV/HBsAg)', price: 800, group: 'Serology' },
        { name: 'ASO', price: 350, group: 'Serology' },
        { name: 'Mantoux Test', price: 350, group: 'Serology' },
        { name: 'PF/PV antigen', price: 300, group: 'Serology' },
        { name: 'Dengue', price: 1000, group: 'Serology' },
        { name: 'Widal test', price: 200, group: 'Serology' },
        { name: 'Stool RE', price: 100, group: 'Stool' },
        { name: 'Stool Occult Blood', price: 150, group: 'Stool' },
        { name: 'TSH', price: 300, group: 'Hormone Assays' },
        { name: 'FT₃, FT₄, TSH', price: 1000, group: 'Hormone Assays' },
        { name: 'FNAC', price: 1200, group: 'Histopathology' },
        { name: 'Biopsy Small', price: 1200, group: 'Histopathology' },
        { name: 'Biopsy Medium', price: 1500, group: 'Histopathology' },
        { name: 'Biopsy Large', price: 2000, group: 'Histopathology' },
        { name: 'Urine RE', price: 100, group: 'Urine' },
        { name: 'Semen Analysis', price: 100, group: 'Semen' },
        { name: 'Biopsy Large Uterus', price: 2000, group: 'Histopathology' },
        { name: 'Biopsy Large Breast (Radical Mastectomy)', price: 2000, group: 'Histopathology' },
        { name: 'Biopsy Large Prostate, Colon (Hemicolectomy)', price: 2000, group: 'Histopathology' },
        { name: 'Biopsy Large Soft Tissue Tumor (Large Size)', price: 2000, group: 'Histopathology' },
        { name: 'Biopsy Large Specimen Size Much Larger', price: 2500, group: 'Histopathology' },
        { name: 'Biopsy Medium Breast (Lumpectomy)', price: 1500, group: 'Histopathology' },
        { name: 'Biopsy Medium Lymph Node', price: 1500, group: 'Histopathology' },
        { name: 'Biopsy Medium Fistula in Ano', price: 1500, group: 'Histopathology' },
        { name: 'Biopsy Small Gallbladder', price: 1200, group: 'Histopathology' },
        { name: 'Biopsy Small Appendix', price: 1200, group: 'Histopathology' },
        { name: 'Biopsy Small Endoscopic Biopsy (Colonoscopy)', price: 1200, group: 'Histopathology' },
      ];

      await this.sql.begin(async (sql) => {
        // Insert item groups
        for (const group of itemGroups) {
          await sql`
            INSERT INTO item_groups (name)
            VALUES (${group.name})
            ON CONFLICT (name) DO NOTHING
          `;
        }

        // Insert items
        for (const item of items) {
          const [group] = await sql`
            SELECT id FROM item_groups WHERE name = ${item.group}
          `;
          await sql`
            INSERT INTO items (name, group_id, price)
            VALUES (${item.name}, ${group.id}, ${item.price})
            ON CONFLICT (name) DO NOTHING
          `;
        }
      });

      console.log('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error; // Re-throw the error to ensure the transaction is rolled back
    }
  }

  private async createTables() {
    try {
      await this.sql.begin(async (sql) => {
        await sql`
          CREATE TABLE IF NOT EXISTS item_groups (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE, -- Add UNIQUE constraint
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
          );
        `;
  
        await sql`
          CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE, -- Add UNIQUE constraint
            group_id INTEGER REFERENCES item_groups(id),
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
          );
        `;
  
        await sql`
          CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            age INTEGER,
            address TEXT,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
          );
        `;
  
        await sql`
          CREATE TABLE IF NOT EXISTS invoices (
            id SERIAL PRIMARY KEY,
            patient_id INTEGER REFERENCES patients(id),
            discount DECIMAL(10, 2) DEFAULT 0,
            amount_paid DECIMAL(10, 2) DEFAULT 0,
            remarks TEXT,
            print_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
          );
        `;
  
        await sql`
          CREATE TABLE IF NOT EXISTS invoice_items (
            id SERIAL PRIMARY KEY,
            invoice_id INTEGER REFERENCES invoices(id),
            item_id INTEGER REFERENCES items(id),
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
          );
        `;
  
        await sql`
          CREATE TABLE IF NOT EXISTS edits (
            id SERIAL PRIMARY KEY,
            entity_name VARCHAR(255) NOT NULL,
            entity_id INTEGER NOT NULL,
            before JSONB,
            after JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
  
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
          );
        `;
      });
  
      console.log('Tables created successfully!');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error; // Re-throw the error to ensure the transaction is rolled back
    }
  }
}