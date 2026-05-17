import { Injectable } from '@nestjs/common';
import { supabase } from './database/supabase';

@Injectable()
export class GradesService {
  async getGrades(userId: string) {
    const { data: ap } = await supabase.from('applicant_profiles')
      .select('first_name, last_name, program').eq('id', userId).maybeSingle();
    const studentName = ap ? `${ap.first_name} ${ap.last_name}` : '';
    const program = ap?.program ?? '';

    const { data: sa } = await supabase.from('student_accounts')
      .select('id').eq('applicant_id', userId).maybeSingle();
    if (!sa) return { studentName, program, grades: [], totalUnits: 0, gwa: '0.00' };

    const { data: rows } = await supabase.from('class_enrollments')
      .select('grades(final_grade, letter_grade, remarks), class_assignments!inner(subjects!inner(code, name, units))')
      .eq('student_id', sa.id);

    const grades = (rows ?? []).map((e: any) => {
      const g = Array.isArray(e.grades) ? e.grades[0] : e.grades;
      return {
        code: e.class_assignments?.subjects?.code ?? '—',
        subject: e.class_assignments?.subjects?.name ?? '—',
        units: e.class_assignments?.subjects?.units ?? 0,
        grade: g?.final_grade != null ? String(g.final_grade) : '—',
        letterGrade: g?.letter_grade ?? '—',
        remarks: g?.remarks ?? '—',
      };
    });

    const totalUnits = grades.reduce((s, g) => s + g.units, 0);
    const nums = grades.map(g => parseFloat(g.grade)).filter(g => !isNaN(g));
    const gwa = nums.length ? (nums.reduce((s, g) => s + g, 0) / nums.length).toFixed(2) : '0.00';
    return { studentName, program, grades, totalUnits, gwa };
  }

  async getDeficiencies(userId: string) {
    const { data: sa } = await supabase.from('student_accounts')
      .select('id').eq('applicant_id', userId).maybeSingle();
    if (!sa) return [];

    const { data } = await supabase.from('class_enrollments')
      .select('grades(final_grade, letter_grade, remarks), class_assignments!inner(subjects!inner(code, name))')
      .eq('student_id', sa.id);

    return (data ?? [])
      .filter((e: any) => {
        const g = Array.isArray(e.grades) ? e.grades[0] : e.grades;
        return g && (g.remarks === 'Failed' || g.remarks === 'Incomplete' || g.letter_grade === 'F' || g.letter_grade === 'INC');
      })
      .map((e: any) => {
        const g = Array.isArray(e.grades) ? e.grades[0] : e.grades;
        return {
          code: e.class_assignments?.subjects?.code ?? '—',
          title: e.class_assignments?.subjects?.name ?? '—',
          finalGrade: g?.final_grade ?? null,
          letterGrade: g?.letter_grade ?? null,
          remarks: g?.remarks ?? null,
        };
      });
  }

  async getGraduation(userId: string) {
    const { data: ap } = await supabase.from('applicant_profiles')
      .select('first_name, last_name, program').eq('id', userId).maybeSingle();
    const studentName = ap ? `${ap.first_name} ${ap.last_name}` : '';
    const program = ap?.program ?? '';

    const { data: sa } = await supabase.from('student_accounts')
      .select('id').eq('applicant_id', userId).maybeSingle();
    if (!sa) return { studentName, program, grades: [] };

    const { data: rows } = await supabase.from('class_enrollments')
      .select('grades(final_grade, letter_grade, remarks), class_assignments!inner(subjects!inner(code, name, units))')
      .eq('student_id', sa.id);

    return {
      studentName, program,
      grades: (rows ?? []).map((e: any) => {
        const g = Array.isArray(e.grades) ? e.grades[0] : e.grades;
        return {
          code: e.class_assignments?.subjects?.code ?? '—',
          title: e.class_assignments?.subjects?.name ?? '—',
          units: e.class_assignments?.subjects?.units ?? 0,
          finalGrade: g?.final_grade ?? null,
          letterGrade: g?.letter_grade ?? null,
          remarks: g?.remarks ?? null,
        };
      }),
    };
  }
}
