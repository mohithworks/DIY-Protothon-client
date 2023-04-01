import supabaseClient from "../utils/supabaseClient";

export async function dbInsert(table, insertData) {
    const { data, error } = await supabaseClient
      .from(table)
      .insert(insertData)
      .select();
  
    return { error, data };
}

export async function dbSelect(table, content, type, content2) {
    const { data, error } = await supabaseClient
      .from(table)
      .select(content)
      .eq(type, content2);
  
    return { error, data };
}

export async function dbSelectOrder(table, content, type, content2) {
    const { data, error } = await supabaseClient
      .from(table)
      .select(content)
      .eq(type, content2)
      .order("created_at", { ascending: true });
  
    return { error, data };
}

export async function dbSelectOrder2(table, content, type, content2, order) {
    const { data, error } = await supabaseClient
      .from(table)
      .select(content)
      .eq(type, content2)
      .order(order, { ascending: true });
  
    return { error, data };
}

export async function dbSelectMulitpleEq(table, content, type1, content1, type2, content2) {
    const { data, error } = await supabaseClient
      .from(table)
      .select(content)
      .eq(type1, content1)
      .eq(type2, content2)
  
    return { error, data };
}

export async function dbSelectMulitpleEqOrder(table, content, type1, content1, type2, content2) {
    const { data, error } = await supabaseClient
      .from(table)
      .select(content)
      .eq(type1, content1)
      .eq(type2, content2)
      .order("votings", { ascending: false });
  
    return { error, data };
}

export async function dbSelectMulitpleEqOrder2(table, content, type1, content1, type2, content2, order) {
    const { data, error } = await supabaseClient
      .from(table)
      .select(content)
      .eq(type1, content1)
      .eq(type2, content2)
      .order(order, { ascending: false });
  
    return { error, data };
}

export async function dbUpdate(table, updateData, type, content) {
    const { data, error } = await supabaseClient
    .from(table)
    .update(updateData)
    .eq(type, content)
    .select();
  
    return { error, data };
}

export async function dbUpdateMulitpleEq(table, updateData, type1, content1, type2, content2) {
    const { data, error } = await supabaseClient
    .from(table)
    .update(updateData)
    .eq(type1, content1)
    .eq(type2, content2)
    .select();
  
    return { error, data };
}
