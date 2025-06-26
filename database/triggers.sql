-- Apply a trigger on every table with column updated_at for updating it upon any UPDATE

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
  table_name TEXT;
  trigger_name TEXT;
BEGIN
  FOR table_name IN
    SELECT t.table_name
    FROM information_schema.tables t
      JOIN information_schema.columns c ON t.table_name = c.table_name
    WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND c.column_name = 'updated_at'
  LOOP
    trigger_name := 'update_' || replace(table_name, '"', '_') || '_updated_at';

    EXECUTE format('
      CREATE TRIGGER %I
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      ', trigger_name, table_name);
  END LOOP;
END $$;

--- Application memory limits

CREATE OR REPLACE FUNCTION check_user_organization_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  max_limit INTEGER;
BEGIN
  SELECT value::INTEGER INTO max_limit 
    FROM application_config 
    WHERE key = 'max_organizations_per_user';
  
  IF max_limit IS NULL THEN
    max_limit := 5;
  END IF;
    
  SELECT COUNT(*) INTO user_count 
    FROM organization 
    WHERE owner_id = NEW.owner_id;
    
  IF user_count >= max_limit THEN
    RAISE EXCEPTION 'User has reached maximum limit of % organizations', max_limit
    USING ERRCODE = 'P0001';
  END IF;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_user_organization_limit
  BEFORE INSERT ON organization
  FOR EACH ROW
  EXECUTE FUNCTION check_user_organization_limit();

---

CREATE OR REPLACE FUNCTION check_organization_inventory_limit()
RETURNS TRIGGER AS $$
DECLARE
  inventory_count INTEGER;
  max_limit INTEGER;
BEGIN
  SELECT value::INTEGER INTO max_limit 
    FROM application_config 
    WHERE key = 'max_inventories_per_organization';
  
  IF max_limit IS NULL THEN
    max_limit := 10;
  END IF;
    
  SELECT COUNT(*) INTO inventory_count 
    FROM inventory 
    WHERE organization_id = NEW.organization_id;
    
  IF inventory_count >= max_limit THEN
    RAISE EXCEPTION 'Organization has reached maximum limit of % inventories', max_limit
    USING ERRCODE = 'P0002';
  END IF;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_organization_inventory_limit
  BEFORE INSERT ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION check_organization_inventory_limit();

---

CREATE OR REPLACE FUNCTION check_organization_item_limit()
RETURNS TRIGGER AS $$
DECLARE
  item_count INTEGER;
  max_limit INTEGER;
BEGIN
  SELECT value::INTEGER INTO max_limit 
    FROM application_config 
    WHERE key = 'max_items_per_organization';
  
  IF max_limit IS NULL THEN
    max_limit := 10;
  END IF;
    
  SELECT COUNT(*) INTO item_count 
    FROM item 
    WHERE organization_id = NEW.organization_id;
    
  IF item_count >= max_limit THEN
    RAISE EXCEPTION 'Organization has reached maximum limit of % items', max_limit
    USING ERRCODE = 'P0003';
  END IF;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_organization_item_limit
  BEFORE INSERT ON item
  FOR EACH ROW
  EXECUTE FUNCTION check_organization_item_limit();

---

CREATE OR REPLACE FUNCTION check_organization_api_key_limit()
RETURNS TRIGGER AS $$
DECLARE
  api_key_count INTEGER;
  max_limit INTEGER;
BEGIN
  SELECT value::INTEGER INTO max_limit 
    FROM application_config 
    WHERE key = 'max_api_keys_per_organization';
  
  IF max_limit IS NULL THEN
    max_limit := 5;
  END IF;
    
  SELECT COUNT(*) INTO api_key_count 
    FROM organization_api_key 
    WHERE organization_id = NEW.organization_id;
    
  IF api_key_count >= max_limit THEN
    RAISE EXCEPTION 'Organization has reached maximum limit of % API keys', max_limit
    USING ERRCODE = 'P0004';
  END IF;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_organization_api_key_limit
  BEFORE INSERT ON organization_api_key
  FOR EACH ROW
  EXECUTE FUNCTION check_organization_api_key_limit();