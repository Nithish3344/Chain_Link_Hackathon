import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.URL;
// const supabaseKey = process.env.KEY;

const supabaseUrl = "https://xlkldthwqotssakgxfqm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa2xkdGh3cW90c3Nha2d4ZnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYzMDQ0ODIsImV4cCI6MjAwMTg4MDQ4Mn0.svoBsIgCOcLu1KA6BsRY09_6GUcr85GDdSYLzy5dGhw";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
