import { Injectable } from '@nestjs/common';
import { supabase } from './database/supabase';

@Injectable()
export class ProfileService {
  async getProfile(userId: string) {
    const [apRes, piRes, abRes, psRes, arRes, saRes] = await Promise.all([
      supabase.from('applicant_profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('parent_information').select('*').eq('applicant_id', userId).maybeSingle(),
      supabase.from('academic_background').select('*').eq('applicant_id', userId).order('completion_year', { ascending: false }),
      supabase.from('program_selections').select('*').eq('applicant_id', userId).maybeSingle(),
      supabase.from('alumni_relatives').select('*').eq('applicant_id', userId),
      supabase.from('student_accounts').select('student_number').eq('applicant_id', userId).maybeSingle(),
    ]);
    return {
      applicant: apRes.data,
      parent: piRes.data,
      academic: abRes.data ?? [],
      program: psRes.data,
      alumni: arRes.data ?? [],
      studentNumber: saRes.data?.student_number ?? null,
    };
  }

  async updateProfile(userId: string, body: any) {
    const { first_name, last_name, middle_name, mobile_number, address } = body;
    const full_name = `${first_name} ${middle_name ?? ''} ${last_name}`.replace(/\s+/g, ' ').trim();
    const { data, error } = await supabase
      .from('applicant_profiles')
      .update({ first_name, last_name, middle_name, mobile_number, address, full_name })
      .eq('id', userId).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
}
