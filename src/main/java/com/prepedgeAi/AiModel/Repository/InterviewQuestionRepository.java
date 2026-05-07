package com.prepedgeAi.AiModel.Repository;




import com.prepedgeAi.AiModel.Entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
}
