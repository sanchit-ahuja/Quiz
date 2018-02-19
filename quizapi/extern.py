from quizapi.models import *


def generateScore(user_p):
    """
    take a user profile as input and then generate their score and update (save) it.
    """
    user_p.score = 0
    for sol in user_p.solution_set.all():
        if sol.question.q_type == 'MCQ':
            if sol.choice.is_correct:
                user_p.score += sol.question.points
            elif sol.choice == None:
                pass
            else:
                user_p.score -= sol.question.neg_points
        elif sol.question.q_type == 'FITB':
            if sol.ans_text.lower().strip() == sol.question.fitb_ans.lower().strip():
                user_p.score += sol.question.points
            else:
                user_p.score -= sol.question.neg_points
        else:
            continue
    user_p.save()
