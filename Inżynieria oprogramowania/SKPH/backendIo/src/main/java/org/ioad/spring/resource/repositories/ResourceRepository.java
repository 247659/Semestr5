package org.ioad.spring.resource.repositories;

import org.ioad.spring.resource.models.Donation;
import org.ioad.spring.resource.models.Resource;
import org.ioad.spring.resource.models.ResourceStatus;
import org.ioad.spring.resource.models.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {
        @Query("SELECT COALESCE(SUM(ra.assignedQuantity), 0) FROM ResourceAssignment ra WHERE ra.resource.id = :resourceId")
        Double getTotalAssignedQuantity(@Param("resourceId") Long resourceId);

        @Query("SELECT r FROM Resource r WHERE r.id = :id")
        Resource findByResourceId(@Param("id") Long id);

        List<Resource> findByStatus(@Param("status") ResourceStatus status);

        @Query("SELECT d FROM Donation d")
        List<Donation> findAllDonation();

        List<Resource> getByResourceType(@Param("resourceType") ResourceType resourceType);

        @Query("SELECT d FROM Donation d WHERE d.resourceType = :resourceType")
        List<Donation> getByDonationType(@Param("resourceType")ResourceType resourceType);

        @Query("SELECT d FROM Donation d WHERE d.donorId = :donorId")
        List<Donation> getByDonationDonorId(@Param("donorId")Long donorId);
}
