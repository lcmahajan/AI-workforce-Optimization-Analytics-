import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: String,
  name: String,
  department: String,
  designation: String,
  accountCreatedOn: Date,
  userPhoto: String,
  orgCode: [String],

  aptitudeScores: {
    spiritScore: Number,
    purposeScore: Number,
    rewardsScore: Number,
    professionScore: Number,
  },

  careerProfile: {
    roles: [String],
    industries: [String],
    tasks: [String],
    skills: [String],
    education: [String],
    careerIdentityStatement: String,
    futureAspirationStatement: String,
  },

  categorizedSkills: {
    bestSkills: [String],
    aboveAvgSkills: [String],
    belowAvgSkills: [String],
    worstSkills: [String],
  },

  extractedHardSkills: [String],

  hardSkillGapAnalysis: {
    job_title: String,
    rationale: String,
    weight: Number,
    benchmark_hardskills: [String],
    missing_hardskills: [String],
  },

  softSkillBenchmark: {
    job_title: String,
    soft_skills: {
      Adaptability: Number,
      Attention_To_Detail: Number,
      Communication: Number,
      Creativity: Number,
      Interpersonal_Skills: Number,
      Leadership: Number,
      Problem_Solving: Number,
      Teamwork: Number,
      Time_Management: Number,
      Work_Ethic: Number,
    }
  },

  softskillScores: {
    Communication: Number,
    Teamwork: Number,
    Adaptability: Number,
    ProblemSolving: Number,
    Creativity: Number,
    WorkEthic: Number,
    InterpersonalSkills: Number,
    TimeManagement: Number,
    Leadership: Number,
    AttentionToDetail: Number,
  },

  softskillScoresFull: [Number],

  parsedResume: {
    _id: String,
    userId: String,
    first_name: String,
    last_name: String,
    email: String,
    contact_number: String,
    github_url: String,
    linkedin_url: String,
    summary: String,
    education: [String],
    experience: [String],
    skills: [String],
    projects: [String],
    activities: [String],
    certificates: [String],
    awards: [String],
    languages: [String],
    createdDate: Date,
    updatedDate: Date,
  },

  resultUpdatedOn: Date,
  skillScore: Number,
});

export default mongoose.model("User", UserSchema);
